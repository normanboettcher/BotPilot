import { List, ListItem} from "@mui/material";
import React from "react";
import { useChatverlauf } from "../context/ChatContext";

import ChatMessageContainer from "./ChatMessageContainer.tsx";

const Chatverlauf: React.FC = () => {
  const { messages } = useChatverlauf();
  return (
    <List
      sx={{
        flexGrow: 1,
        overflowY: "auto",
      }}
    >
      {messages &&
        messages.map((msg, index) => (
          <ListItem key={index} alignItems="flex-start">
                <ChatMessageContainer chatMessage={msg}/>
          </ListItem>
        ))}
    </List>
  );
};

export default Chatverlauf;
