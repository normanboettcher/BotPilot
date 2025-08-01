import type { Sender } from "../../domain/Sender.ts";

export interface ChatMessageComponentProps {
  backgroundColor: string;
  textColor: string;
  align: "flex-start" | "flex-end";
  text: string;
  sender: Sender;
}
