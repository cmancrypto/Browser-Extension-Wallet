import React from 'react';

export const ArrowLeft: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask
      id="a"
      // style="mask-type:alpha"
      maskUnits="userSpaceOnUse"
      x="4"
      y="0"
      width="12"
      height="20"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.457.783c.502.488.502 1.28 0 1.768L7.8 10l7.656 7.45c.502.487.502 1.279 0 1.767a1.31 1.31 0 0 1-1.817 0L4.167 10 13.64.783a1.31 1.31 0 0 1 1.817 0Z"
        fill="#FFFFFF"
      />
    </mask>
    <g mask="url(#a)">
      <path fill="currentColor" d="M0-.001h19.999v19.999H0z" />
    </g>
  </svg>
);
