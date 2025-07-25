// src/pages/CustomSortIcon.js
import React from "react";

const CustomSortIcon = ({ size = 24, color = "black" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="5" width="16" height="2" rx="1" />
    <rect x="4" y="10" width="12" height="2" rx="1" />
    <rect x="4" y="15" width="8" height="2" rx="1" />
  </svg>
);

export default CustomSortIcon;
