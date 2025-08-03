import type { ChatMessageType } from '../domain/ChatMessage.ts';
import useMessageCreator from '../service/MessageCreator.ts';

const useOpeningMessage = (): { opening: ChatMessageType } => {
  const { createChatMessage } = useMessageCreator();
  const message =
    'Hallo, ich bin BotPilot. Ich stehe Ihnen zu Fragen rundum die Kanzlei XY zur Vefügung sowie zu ' +
    'allen organisatorischen und auch steuerlichen Fragen. Wie kann ich Ihnen heute helfen?';
  const opening = createChatMessage(message, 'bot');
  return {
    opening: { ...opening, type: 'opening' },
  };
};
export default useOpeningMessage;
