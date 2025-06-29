import type {Sender} from "./Sender.ts";

export interface BotResponse {
  text: string;
  sender: Sender;
}
