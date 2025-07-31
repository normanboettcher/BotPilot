import {Paper} from "@mui/material";
import React from "react";
import ChatInput from "./ChatInput/ChatInput.tsx";
import Chatverlauf from "./Chatverlauf";
import useBotResponsive from "../hooks/useBotResponsive.ts";

type Props = {
    visible: boolean;
};

const Chatbox: React.FC<Props> = ({visible}) => {
    const {isMobile} = useBotResponsive();
    return (
        <Paper
            id="chatbox"
            elevation={4}
            sx={{
                width: isMobile ? '100vw' : 400,
                height: isMobile ? '100vh' : 500,
                display: visible ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#fef9f3",
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "0.3rem",
                paddingTop: "2rem",
                marginBottom: isMobile ? 0 : ' 10px',
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                mt: isMobile ? 0 : 2,
            }}
        >
            <Chatverlauf/>
            <ChatInput/>
        </Paper>
    );
};

export default Chatbox;
