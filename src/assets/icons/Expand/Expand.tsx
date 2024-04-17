import React from 'react';

export const Expand: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2 18V6h2v12H2ZM9.45 7.05 4.5 12l4.947 4.947 1.415-1.414L8.328 13h7.343l-2.535 2.535 1.414 1.414L19.5 12l-4.95-4.95-1.414 1.415L15.672 11H8.328l2.536-2.536L9.45 7.05ZM20 6h2v12h-2V6Z"
      fill="currentColor"
    />
  </svg>
);
