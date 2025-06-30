import type { Sender } from "./Sender.ts";

export interface BotResponse {
  answer: string;
  sender: Sender;
  success: boolean;
  score?: number;
  timestamp: string;
}
