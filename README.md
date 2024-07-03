# WebOS Client

[![JSR Scope](https://jsr.io/badges/@bukhalo)](https://jsr.io/@bukhalo)
[![JSR Score](https://jsr.io/badges/@bukhalo/webos-client/score)](https://jsr.io/@bukhalo/webos-client)
[![JSR](https://jsr.io/badges/@bukhalo/webos-client)](https://jsr.io/@bukhalo/webos-client)

Add package in your project:

```bash
deno add @bukhalo/webos-client
```

Or add package without install step:

```typescript
import { Client } from "jsr:@bukhalo/webos-client";
```

Initialize the `Client` class by passing the IP address of the TV as the first
argument, and run `register()` function:

```typescript
import { Client } from "@bukhalo/webos-client";

const client = new Client("192.168.0.1");
await client.register();
```

<!-- deno-fmt-ignore -->
> [!IMPORTANT]
> Once `register()` is executed, it will send a connection request to the TV, don't forget to confirm it. This is the reason why the function returns a promise.
>
> After confirming the request on the TV, you need to save the token. If the code is executed in a Deno environment, the token will be automatically saved to `localStorage`. If the code is not executed in Deno or you want to change the default behavior, create your own class for storage by inheriting the `Storage` abstract class from the package. You can specify your own storage when initializing the client by passing it as the second argument.

After that you can call one of the available methods, for example `volumeUp()`:

```typescript
import { Client } from "@bukhalo/webos-client";

const client = new Client("192.168.0.1");
await client.register();

await client.volumeUp();
```

Or send a custom request if you know `type`, `uri` and `payload` for that
request:

```typescript
import { Client, MessageType } from "@bukhalo/webos-client";

const client = new Client("192.168.0.1");
await client.register();

await client.sendMessage({
  type: MessageType.REQUEST,
  uri: "ssap://audio/volumeUp",
});
```

<!-- deno-fmt-ignore -->
> [!NOTE]
> Please note there are a very limited number of ready-made requests available in the client at the moment.

### Reference

- https://github.com/bendavid/aiopylgtv/
- https://github.com/merdok/homebridge-webos-tv
- https://github.com/hobbyquaker/lgtv2
- https://github.com/home-assistant/home-assistant.io/issues/17685
- https://community.home-assistant.io/t/lg-webos-change-picture-setting-mode-with-scripts/262915/3
- https://www.webosbrew.org/pages/commands-cheatsheet.html
