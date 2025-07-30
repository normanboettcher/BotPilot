import type {SVGProps} from "react";
import React from "react";
import {blue,} from "@mui/material/colors";
import {Avatar} from "@mui/material";

function User3Fill(props?: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            {...props}
        >
            <path
                fill="currentColor"
                d="M20 22H4v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5zm-8-9a6 6 0 1 1 0-12a6 6 0 0 1 0 12"
            ></path>
        </svg>
    )
}

const UserAvatar = () => {
    const style = {bgcolor: blue[500]};
    return (
        <Avatar sx={style}>
            {User3Fill()}
        </Avatar>
    )
}

export default UserAvatar;
