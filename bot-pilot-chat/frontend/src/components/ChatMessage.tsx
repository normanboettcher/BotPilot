import React from "react";
import type { Sender } from "../domain/Sender.ts";
import LargeChatMessageComponent from "./LargeChatMessageComponent.tsx";
import SmallChatMessageComponent from "./SmallChatMessageComponent.tsx";

type Props = {
  text: string;
  sender: Sender;
};

const ChatMessage: React.FC<Props> = ({ text, sender }) => {
  const isUser = sender === "user";
  // Farben & Styles je nach Absender
  const backgroundColor = isUser ? "primary.main" : "grey.200";
  const textColor = isUser ? "white" : "black";
  const align = isUser ? "flex-end" : "flex-start";
  const useChip = text.length > 50;
  if (useChip) {
    return (
      <SmallChatMessageComponent
        align={align}
        backgroundColor={backgroundColor}
        textColor={textColor}
        text={text}
      />
    );
  }
  return (
    <LargeChatMessageComponent
      align={align}
      backgroundColor={backgroundColor}
      textColor={textColor}
      text={text}
    ></LargeChatMessageComponent>
  );
};

export default ChatMessage;
