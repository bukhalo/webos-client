import { assertObjectMatch } from "./deps_test.ts";
import { Client } from "./client.ts";
import { MessageType } from "./message_type.ts";

Deno.test("client", async (test) => {
  const url = Deno.args[0];
  if (!url) {
    throw new Error(`WebSocket URL not found! Pass URL as first CLI argument`);
  }
  const client = new Client(url);

  await client.register();

  await test.step("volumeUp", async () => {
    const res = await client.sendMessage({
      type: MessageType.REQUEST,
      uri: "ssap://audio/volumeUp",
    });
    assertObjectMatch({
      volume: 8,
      returnValue: true,
      soundOutput: "tv_external_speaker",
    }, res);
  });

  await test.step("volumeDown", async () => {
    const res = await client.sendMessage({
      type: MessageType.REQUEST,
      uri: "ssap://audio/volumeDown",
    });
    assertObjectMatch({
      volume: 7,
      returnValue: true,
      soundOutput: "tv_external_speaker",
    }, res);
  });

  client.close();
  Deno.exit(0);
});
