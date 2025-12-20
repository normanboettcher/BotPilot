import { useEffect, useState } from 'react';
import { useColorService } from './ColorServiceImpl.ts';
import type { ColorKey } from '../../domain/graphics/ColorKey.ts';

interface Props {
  chatTextColor: string;
  chatBubbleColorUser: string;
}

export const useChatMessageGraphicsService = (): Props => {
  const [textColor, setTextColor] = useState<string>();
  const [chatBubbleColorUser, setChatBubbleColorUser] = useState<string>();
  useEffect(() => {
    const fetchData = async () => {
      const chatTextColor = await fetchColor('chat_text');
      const chatBubbleUserColor = await fetchColor('user_chat_bubble');

      if (chatTextColor) {
        setTextColor(chatTextColor);
      }
      if (chatBubbleUserColor) {
        setChatBubbleColorUser(chatBubbleUserColor);
      }
    };
    fetchData();
  }, []);

  // TODO: write a ChatMessageGraphicsService
  const fetchColor = async (key: ColorKey) => {
    const colorService = useColorService();
    const { color } = await colorService.getColor(key);

    return color;
  };
  return {
    chatTextColor: textColor ?? '',
    chatBubbleColorUser: chatBubbleColorUser ?? '',
  };
};
