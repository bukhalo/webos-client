export class WebOSError extends Error {
  public requestId: string;

  constructor(requestId: string, message: string) {
    super(message);
    this.name = WebOSError.name;
    this.requestId = requestId;
  }
}
