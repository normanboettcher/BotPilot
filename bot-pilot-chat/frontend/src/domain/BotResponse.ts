import type { Sender } from './Sender.ts';
import type { ButtonOption } from './ButtonOption.ts';

export interface BotResponse {
  answer: string;
  sender: Sender;
  success: boolean;
  score?: number;
  timestamp: string;
  buttons?: ButtonOption[];
}
