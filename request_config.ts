import { MessageType } from "./message_type.ts";

export interface RequestConfig {
  id?: string;
  type: MessageType;
  payload?: Record<string, any>;
  uri?: string;
}
