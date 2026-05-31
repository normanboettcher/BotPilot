import { useTenantTheme } from '../../context/TenantThemeContext.tsx';

interface ChatMessageGraphics {
  chatTextColor: string;
  chatBubbleColorUser: string;
  chatBubbleColorBot: string;
  userTextColor: string;
}

export const useChatMessageGraphicsService = (): ChatMessageGraphics => {
  const theme = useTenantTheme();
  return {
    chatTextColor: theme.botBubbleTextColor,
    chatBubbleColorUser: theme.userBubbleColor,
    chatBubbleColorBot: theme.botBubbleColor,
    userTextColor: theme.userBubbleTextColor,
  };
};
