
import React from "react";
import type {Sender} from "../domain/Sender.ts";
import { Chip } from "@mui/material";

type Props = {
    text: string;
    sender: Sender;
}

const ChatMessage: React.FC<Props> = ({text, sender}) => {
    const color = sender === 'bot' ? 'success' : 'default';
    return (
        <Chip
            sx={{
                height: "auto",
                "& .MuiChip-label": {
                    display: "block",
                    whiteSpace: "normal",
                },
            }}
            color={color}
            size="medium"
            variant="filled"
            label={text}
        />
    )
}

export default ChatMessage;