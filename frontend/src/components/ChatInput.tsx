import {Box, Stack, TextField} from "@mui/material";
import React, {useState, type ChangeEventHandler} from "react";
import SendButton from "./SendButton";
import {useChatverlauf} from "../context/ChatContext";
import type {BotResponse} from "../types";
import type {ChatMessageType} from "../domain/ChatMessage.types.ts";

const ChatInput: React.FC = () => {
    const {addMessage} = useChatverlauf();
    const [input, setInput] = useState<string>('');
    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = createChatMessage(input, 'user');
        addMessage(userMessage);
        setInput('');
        try {
            const res = await fetch(
                `http://localhost:8000/chat?q=${encodeURIComponent(input)}`
            );
            const data = (await res.json()) as BotResponse;
            const botMessage = createChatMessage(data.response, 'bot');
            addMessage(botMessage)
        } catch (error) {
            console.error('Fehler beim Abrufen der Antwort:', error);
            const errorMessage = createChatMessage('Fehler bei der Verbindung zum Server:', 'bot');
            addMessage(errorMessage);
        }
    };

    const createChatMessage = (text: string, sender: "user" | "bot") => {
        const date: Date = new Date();
        const chatMessage: ChatMessageType = {
            sender: sender,
            message: text,
            timestamp: `${date.getDay() + 1}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
        };
        return chatMessage;
    };

    const onChange: ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement | undefined
    > = (e) => {
        setInput(e.target.value);
    };

    return (
        <Box maxHeight={280}>
            <Box
                id="chatbot-input"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "0.5rem",
                    flex: 1,
                    "& .MuiInputBase-root": {
                        padding: "0.5rem",
                    },
                }}
            >
                <Stack direction={"column"} spacing={1}>
                    <TextField
                        variant="outlined"
                        multiline
                        maxRows={4}
                        onChange={onChange}
                        value={input}
                        onKeyDown={async (e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                await handleSend();
                                setInput('')
                            }
                        }}
                        placeholder="Frage eingeben..."
                        size="small"
                        fullWidth
                    />
                    <SendButton onClick={handleSend}/>
                </Stack>
            </Box>
        </Box>
    );
};

export default ChatInput;
