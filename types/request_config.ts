import type { MessageType } from "./message_type.ts";

export type RequestConfig<P = Record<string, any>> = {
  id?: string;
  type: MessageType;
  payload?: P;
  uri?: string;
};
