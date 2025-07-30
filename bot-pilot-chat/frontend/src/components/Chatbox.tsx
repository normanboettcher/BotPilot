import {Box} from "@mui/material";
import React from "react";
import ChatInput from "./ChatInput/ChatInput.tsx";
import Chatverlauf from "./Chatverlauf";

type Props = {
    visible: boolean;
};

const Chatbox: React.FC<Props> = ({visible}) => {
    return (
        <Box
            id="chatbox"
            sx={{
                width: '100%',
                display: visible ? "flex" : "none",
                flexDirection: "column",
                backgroundColor: "#fef9f3",
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "0.3rem",
                paddingTop: "1rem",
                marginBottom: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                mt: 2,
                transform: {
                    xs: 'scale(1.05)',
                    sm: 'scale(1)',
                },
                transformOrigin: 'bottom right',
                fontSize: {
                    xs: '0.9rem',
                    sm: '1rem',
                }
            }}
        >
            <Chatverlauf/>
            <ChatInput/>
        </Box>
    );
};

export default Chatbox;
