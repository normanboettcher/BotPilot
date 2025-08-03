export interface ChatMessageType {
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
  type?: 'opening' | 'closing';
}
