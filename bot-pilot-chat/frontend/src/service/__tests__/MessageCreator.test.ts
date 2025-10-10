import { expect, it, describe } from 'vitest';
import useMessageCreator from '../MessageCreator.ts';
import type { BotResponse } from '../../domain/BotResponse.ts';

describe('MessageCreator testcases', () => {
  it('should create a chat message with text', () => {
    const { createChatMessage } = useMessageCreator();
    const botResponse: BotResponse = {
      answer: 'Hello World!',
      sender: 'bot',
      success: true,
      timestamp: new Date().toISOString(),
    };
    const result = createChatMessage(
      botResponse.answer,
      botResponse.sender,
      botResponse.accessory,
      botResponse.buttons
    );
    expect(result.sender).toEqual('bot');
    expect(result.message).toEqual('Hello World!');
    expect(result.timestamp).toBeDefined();
    console.log('created test message with timestamp', result.timestamp);
  });
});
