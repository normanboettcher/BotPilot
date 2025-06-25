import { Chip, List, ListItem,  Stack } from "@mui/material";
import React from "react";
import { useChatverlauf } from "../context/ChatContext";
import SenderAvatar from "./SenderAvatar";

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
            {msg.sender === "user" ? (
              <Stack direction="row">
                <SenderAvatar sender={msg.sender} />
                <Chip
                  sx={{
                    height: "auto",
                    "& .MuiChip-label": {
                      display: "block",
                      whiteSpace: "normal",
                    },
                  }}
                  size="medium"
                  variant="filled"
                  label={msg.message}
                />
              </Stack>
            ) : (
              <Stack direction="row" spacing={1}>
                <Chip
                  sx={{
                    height: "auto",
                    "& .MuiChip-label": {
                      display: "block",
                      whiteSpace: "normal",
                    },
                  }}
                  color="success"
                  size="medium"
                  variant="filled"
                  label={msg.message}
                />
                <SenderAvatar sender={msg.sender} />
              </Stack>
            )}
          </ListItem>
        ))}
    </List>
  );
};

export default Chatverlauf;
