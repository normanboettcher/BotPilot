import React from "react";
import SenderAvatar from "../Avatar/SenderAvatar.tsx";
import type {ChatMessageType} from "../../domain/ChatMessage.ts";
import {Box, Stack} from "@mui/material";
import ChatMessage from "./ChatMessage.tsx";

type Props = {
    chatMessage: ChatMessageType;
};

const ChatMessageContainer: React.FC<Props> = ({chatMessage}) => {
    const {sender, message} = chatMessage;
    return (
        <Box
            width={"100%"}
            display={"flex"}
            justifyContent={sender === "user" ? "flex-end" : "flex-start"}
        >
            <Stack direction={sender === "user" ? "row-reverse" : "row"} spacing={1}>
                <SenderAvatar sender={sender}/>
                <ChatMessage sender={sender} text={message}/>
            </Stack>
        </Box>
    );
};

export default ChatMessageContainer;
