import useRestClient from "./RestClient.ts";
import type { BotResponse } from "../domain/BotResponse.ts";
import useMessageCreator from "./MessageCreator.ts";
import type { Query } from "../domain/Query.ts";

const useMessageService = () => {
  const sendMessageAndGetResponse = async (message: string) => {
    const { send } = useRestClient();
    const { createChatMessage } = useMessageCreator();
    try {
      const query: Query = { question: message };
      const messageResponse = await send(query);
      if (!messageResponse) {
        return undefined;
      }
      const messageData = (await messageResponse.json()) as BotResponse;

      return createChatMessage(messageData.answer, messageData.sender);
    } catch (error) {
      console.error(error);
      throw Error(
        `Failed to send message. Received Error: ${JSON.stringify(error)}`,
      );
    }
  };
  return {
    sendMessageAndGetResponse,
  };
};

export default useMessageService;
