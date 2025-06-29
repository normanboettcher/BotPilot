import React from "react";
import type { Sender } from "../domain/Sender";
import { Avatar} from "@mui/material";
import SmartToy from "@mui/icons-material/SmartToy";
import Person from "@mui/icons-material/Person";

type Props = {
  sender: Sender;
};

const SenderAvatar: React.FC<Props> = ({ sender }) => {
  return (
      <Avatar>{sender === "user" ? <Person/> : <SmartToy/>}</Avatar>
  );
};

export default SenderAvatar;