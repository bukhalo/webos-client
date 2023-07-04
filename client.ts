import { Storage } from "./storage/storage.ts";
import { LocalStorage } from "./storage/local_storage.ts";

import { CreateAlertPayload } from "./types/create_alert_payload.ts";
import { Endpoint } from "./types/endpoint.ts";
import { MessageType } from "./types/message_type.ts";
import { type RequestConfig } from "./types/request_config.ts";

import { pairingPayload } from "./pairing_payload.ts";
import { waitCondition } from "./utils.ts";
import { WebOSError } from "./webos_error.ts";

export class Client extends WebSocket {
  #storage: Storage;
  #storageKey: string;
  #eventsStore: Record<string, any> = {};
  #clientKey!: string | null;

  constructor(
    url: string | URL,
    storage: Storage = new LocalStorage(),
    protocols?: string | string[],
  ) {
    super(url, protocols);
    this.#storage = storage;
    this.#storageKey = `webos-client-token-${url}`;
    this.onmessage = this.#onmessage;
  }

  public async register() {
    this.#clientKey = await this.#storage.get(this.#storageKey);

    // check connection
    await waitCondition(() => this.readyState === 1, 1000);

    const payload: { [k: string]: any } = pairingPayload;

    // add auth token into pairing payload
    if (this.#storageKey) payload["client-key"] = this.#clientKey;

    const id = crypto.randomUUID();
    const res = await this.sendMessage({
      id,
      type: MessageType.REGISTER,
      payload,
    });

    // save the token, after confirming pairing on TV
    if (res?.pairingType === "PROMPT") {
      const res = await this.#getResponseById(id);
      await this.#storage.set(this.#storageKey, res["client-key"]);
      return res;
    }

    return res;
  }

  public async sendMessage<P = Record<string, any>, R = Record<string, any>>(
    { id = crypto.randomUUID(), type, uri, payload }: RequestConfig<P>,
  ): Promise<R> {
    const message = { id, type, uri, payload };
    this.send(JSON.stringify(message));
    return await this.#getResponseById(id) as R;
  }

  /**
   * Dirty hack for call internal luna API
   * @see https://github.com/bendavid/aiopylgtv/blob/6b676ea69cb77f4e363d8fc5934cc126d07ad537/aiopylgtv/webos_client.py#L1162
   */
  public async sendLunaMessage(
    uri: string,
    params: Record<string, any>,
  ): Promise<void> {
    const buttons = [{ label: "", onclick: uri, params }];
    const payload: CreateAlertPayload = {
      message: " ",
      buttons: buttons,
      onclose: { uri, params: params },
      onfail: { uri, params: params },
    };

    const { alertId } = await this.createAlert(payload);
    await this.closeAlert({ alertId: alertId });
  }

  public async createAlert(payload: CreateAlertPayload) {
    return await this.sendMessage<CreateAlertPayload, { alertId: string }>({
      type: MessageType.REQUEST,
      uri: Endpoint.CREATE_ALERT,
      payload,
    });
  }

  public async closeAlert(payload: { alertId: string }) {
    return await this.sendMessage({
      type: MessageType.REQUEST,
      uri: Endpoint.CLOSE_ALERT,
      payload,
    });
  }

  public async closeAllAlerts() {
    return await this.sendMessage({
      type: MessageType.REQUEST,
      uri: Endpoint.CLOSE_ALL_ALERTS,
    });
  }

  public async volumeUp() {
    return await this.sendMessage({
      type: MessageType.REQUEST,
      uri: Endpoint.VOLUME_UP,
    });
  }

  public async volumeDown() {
    return await this.sendMessage({
      type: MessageType.REQUEST,
      uri: Endpoint.VOLUME_DOWN,
    });
  }

  async #getResponseById(id: string): Promise<Record<string, any>> {
    await waitCondition(() => id in this.#eventsStore);
    const payload = this.#eventsStore[id];
    delete this.#eventsStore[id];
    return payload;
  }

  #onmessage(ev: MessageEvent<string>) {
    try {
      const data = JSON.parse(ev.data) as Record<string, any>;
      this.#eventsStore[data.id] = data.payload;

      if (data.type === "error") {
        throw new WebOSError(data.id, data.error);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
