import React from "react";

const ProfileIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="8.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <circle
      cx="12"
      cy="9"
      r="2.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M7.2 17.2c.8-1.7 2.9-2.8 4.8-2.8s4 1.1 4.8 2.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

export default ProfileIcon;
