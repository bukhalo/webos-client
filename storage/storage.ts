export abstract class Storage {
  public abstract get(key: string): Promise<string> | string;
  public abstract set(key: string, value: string): Promise<void> | void;
}
