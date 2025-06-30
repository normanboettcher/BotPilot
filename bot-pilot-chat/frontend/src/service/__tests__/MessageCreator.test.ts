import { expect, it, describe } from "vitest";
import useMessageCreator from "../MessageCreator.ts";
import type { BotResponse } from "../../domain/BotResponse.ts";

describe("MessageCreator testcases", () => {
  it("should create a chat message with text", () => {
    const { createChatMessage } = useMessageCreator();
    const botResponse: BotResponse = {
      text: "Hello World!",
      sender: "bot",
    };
    const result = createChatMessage(botResponse.text, botResponse.sender);
    expect(result.sender).toEqual("bot");
    expect(result.message).toEqual("Hello World!");
    expect(result.timestamp).toBeDefined();
    console.log("created test message with timestamp", result.timestamp);
  });
});
