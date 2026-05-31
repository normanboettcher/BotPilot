import type { ChatMessageText } from '../domain/ChatMessageText.ts';
import useMessageCreator from '../service/MessageCreator.ts';
import { useTenantTheme } from './TenantThemeContext.tsx';

const useOpeningMessage = (): { opening: ChatMessageText } => {
  const { createChatMessage } = useMessageCreator();
  const { welcomeMessage } = useTenantTheme();
  const opening = createChatMessage(welcomeMessage, 'bot');
  return { opening };
};

export default useOpeningMessage;
