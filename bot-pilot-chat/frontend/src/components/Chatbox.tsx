import {Box} from "@mui/material";
import React from "react";
import ChatInput from "./ChatInput";
import Chatverlauf from "./Chatverlauf";

type Props = {
    visible: boolean;
};

const Chatbox: React.FC<Props> = ({visible}) => {
    return (
        <Box
            id="chatbox"
            maxHeight={280}
            sx={{
                display: visible ? "flex" : "none",
                flexDirection: "column",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "1rem",
                width: "280px",
                marginBottom: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                mt: 2,
            }}
        >
            <Chatverlauf/>
            <ChatInput/>
        </Box>
    );
};

export default Chatbox;
