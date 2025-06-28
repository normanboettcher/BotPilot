import React from 'react';
import {TextField, type TextFieldProps} from "@mui/material";


const ChatTextField: React.FC<TextFieldProps> = ({...props}) => {
    return (
        <TextField
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
    )
}

export default ChatTextField;

