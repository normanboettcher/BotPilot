import type { SVGProps } from 'react';
import React from 'react';

function AlarmClockCheck(props?: SVGProps<SVGSVGElement>) {
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
        <circle cx="12" cy="13" r="8"></circle>
        <path d="M5 3L2 6m20 0l-3-3M6.38 18.7L4 21m13.64-2.33L20 21M9 13l2 2l4-4"></path>
      </g>
    </svg>
  );
}

const AlarmClock = () => {
  return <AlarmClockCheck />;
};
export default AlarmClock;
