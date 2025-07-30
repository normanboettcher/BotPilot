import {Box} from "@mui/material";
import React, {useState} from "react";
import ChatBotButton from "./Buttons/ChatBotButton.tsx";
import Chatbox from "./Chatbox";

const BotContainer = (): React.ReactNode => {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <Box
            id="chatbot-container"
            sx={{
                position: "fixed",
                width: {
                    xs: "90%",
                    sm: '80%',
                    md: '50%',
                    lg: '40%',
                },
                p: {
                    xs: 1.5,
                    sm: 2
                },
                fontSize: {
                    xs: '0.9rem',
                    sm: '1rem',
                    md: '1.1rem',
                    lg: '1.2rem',
                },
                maxHeight: '80vh',
                margin: "0 auto",
                bottom: 16,
                right: 16,
                fontFamily: "sans-serif",
                zIndex: 1300,
            }}
        >
            <ChatBotButton onClick={() => setVisible(!visible)}/>
            <Chatbox visible={true}/>
        </Box>
    );
};

export default BotContainer;
