import { Storage } from "./storage.ts";

export class LocalStorage extends Storage {
  public get(key: string) {
    return localStorage.getItem(key)!;
  }

  public set(key: string, value: string): void {
    return localStorage.setItem(key, value);
  }
}
