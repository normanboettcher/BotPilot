import useBotResponsive from '../hooks/useBotResponsive.ts';

const useChatbotTheme = () => {
  // @ts-ignore
  const { isDarkTheme } = useBotResponsive();
};
export default useChatbotTheme;
