/**
 * @see https://www.webosose.org/docs/reference/ls2-api/com-webos-notification/#object-button
 */
export type Button = {
  label: string;
  onclick?: string;
  onClick?: string;
  params: Record<string, any>;
  buttonType?: "ok" | "cancel";
  focus?: boolean;
};

/**
 * @see https://www.webosose.org/docs/reference/ls2-api/com-webos-notification/#object-onclose
 */
export type OnClose = {
  uri?: string;
  params?: Record<string, any>;
};

/**
 * @see https://www.webosose.org/docs/reference/ls2-api/com-webos-notification/#object-onfail
 */
export type OnFail = {
  uri: string;
  params: Record<string, any>;
};

/**
 * @see https://www.webosose.org/docs/reference/ls2-api/com-webos-notification/#parameters-3
 */
export type CreateAlertPayload = {
  iconUrl?: string;
  title?: string;
  message: string;
  modal?: boolean;
  buttons: Button[];
  onclose?: OnClose;
  type?: "confirm" | "warning" | "progress";
  isSysReq?: boolean;
  onfail?: OnFail;
};
