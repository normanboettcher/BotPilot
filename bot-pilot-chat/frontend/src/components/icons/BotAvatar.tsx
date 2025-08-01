import type { SVGProps } from "react";
import React from "react";
import { Avatar } from "@mui/material";
import { grey } from "@mui/material/colors";

function MessageChatbot(props?: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM9.5 9h.01m4.99 0h.01"></path>
        <path d="M9.5 13a3.5 3.5 0 0 0 5 0"></path>
      </g>
    </svg>
  );
}

const BotAvatar = () => {
  const style = { bgcolor: grey[700] };
  return <Avatar sx={style}>{MessageChatbot()}</Avatar>;
};
export default BotAvatar;
