import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import type { ChatMessage } from "../domain/ChatMessage";
import React from "react";

type Props = {
    messages?: ChatMessage[]
}

const Chatverlauf: React.FC<Props> = ({messages}) => {
    return (
        <List sx={{
            flexGrow: 1,
            overflowY: 'auto'
        }}>
           {messages && messages.map((msg, index) => (
            <ListItem key={index} alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar>{msg.sender === 'user' ? '👤' : '🤖'}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={msg.message}/>
            </ListItem>
           ))
        }
        </List>
    )
}

export default Chatverlauf;