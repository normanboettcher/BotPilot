import {Box} from "@mui/material";
import React, {useState} from "react";
import ChatBotButton from "./Buttons/ChatBotButton.tsx";
import Chatbox from "./Chatbox";
import useBotResponsive from "../hooks/useBotResponsive.ts";

const BotContainer = (): React.ReactNode => {
    const [visible, setVisible] = useState<boolean>(false);
    const {isMobile} = useBotResponsive();
    return (
        <Box
            id="chatbot-container"
            sx={{
                position: "fixed",
                width: isMobile ? '100vw' : 'auto',
                bottom: isMobile ? 0 : 16,
                right: isMobile ? 0 : 16,
                left: isMobile ? 0 : 'auto',
                top: isMobile ? 0 : 'auto',
                padding: '1rem',
                fontFamily: "sans-serif",
                zIndex: 9999,
            }}
        >
            <ChatBotButton onClick={() => setVisible(!visible)}/>
            <Chatbox visible={true}/>
        </Box>
    );
};

export default BotContainer;
