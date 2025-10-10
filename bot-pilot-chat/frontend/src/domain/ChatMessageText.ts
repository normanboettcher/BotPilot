import type { ButtonOption } from './ButtonOption.ts';

export interface ChatMessageText {
  type: 'text';
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
  accessory?: 'calendar' | 'buttons';
  buttons?: ButtonOption[];
}

export interface ChatMessageButton {
  type: 'button';
  sender: 'user' | 'bot';
  timestamp: string;
  button: ButtonOption;
}
