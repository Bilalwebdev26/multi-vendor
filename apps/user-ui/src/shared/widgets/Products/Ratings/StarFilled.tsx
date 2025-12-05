// import React from 'react'

// const StarFilled = () => {
//   return (
//     <div>StarFilled</div>
//   )
// }

// export default StarFilled
import React, { FC } from "react";

type IconProps = { size?: number; className?: string };

// Full star
export const StarFull: FC<IconProps> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} role="img" aria-label="Full star" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5l2.9 6.1 6.7.6-5.1 4.2 1.6 6.4L12 17.8 5.9 20.4l1.6-6.4L2.4 9.8l6.7-.6L12 2.5z"
          fill="#FFD700" stroke="#D6A600" strokeWidth="0.5" strokeLinejoin="round"/>
  </svg>
);

// Half star
export const StarHalf: FC<IconProps> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} role="img" aria-label="Half star" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="half-clip-react">
        <rect x="0" y="0" width="12" height="24" />
      </clipPath>
    </defs>
    <path d="M12 2.5l2.9 6.1 6.7.6-5.1 4.2 1.6 6.4L12 17.8 5.9 20.4l1.6-6.4L2.4 9.8l6.7-.6L12 2.5z"
          fill="#FFD700" clipPath="url(#half-clip-react)" stroke="none"/>
    <path d="M12 2.5l2.9 6.1 6.7.6-5.1 4.2 1.6 6.4L12 17.8 5.9 20.4l1.6-6.4L2.4 9.8l6.7-.6L12 2.5z"
          fill="none" stroke="#D6A600" strokeWidth="0.65" strokeLinejoin="round"/>
  </svg>
);

// Empty star
export const StarEmpty: FC<IconProps> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} role="img" aria-label="Empty star" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5l2.9 6.1 6.7.6-5.1 4.2 1.6 6.4L12 17.8 5.9 20.4l1.6-6.4L2.4 9.8l6.7-.6L12 2.5z"
          fill="none" stroke="#D6A600" strokeWidth="0.9" strokeLinejoin="round"/>
  </svg>
);
