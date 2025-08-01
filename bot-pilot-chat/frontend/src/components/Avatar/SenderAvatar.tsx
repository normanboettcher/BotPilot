import React from "react";
import type { Sender } from "../../domain/Sender.ts";
import BotAvatar from "../icons/BotAvatar.tsx";
import UserAvatar from "../icons/UserAvatar.tsx";

type Props = {
  sender: Sender;
};

const SenderAvatar: React.FC<Props> = ({ sender }) => {
  return sender === "user" ? <UserAvatar /> : <BotAvatar />;
};

export default SenderAvatar;
