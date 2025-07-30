import React from "react";
import {InputAdornment, TextField, type TextFieldProps} from "@mui/material";
import type {BotTextFieldProps} from "../../domain/BotTextFieldProps.ts";

const ChatTextField: React.FC<TextFieldProps & BotTextFieldProps> = ({
                                                                         ...props
                                                                     }) => {
    return (
        <TextField
            InputProps={{
                endAdornment: props.sendButton && (
                    <InputAdornment position={"end"}>{props.sendButton}</InputAdornment>
                ),
            }}
            sx={{
                fontSize: {
                    xs: '0.85rem',
                    sm: '1rem',
                },
            }}
            variant="outlined"
            multiline
            maxRows={4}
            onChange={props.onChange}
            value={props.value}
            onKeyDown={props.onKeyDown}
            placeholder="Frage eingeben..."
            size="small"
            fullWidth
        />
    );
};

export default ChatTextField;
