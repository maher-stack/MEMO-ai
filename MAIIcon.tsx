import React from 'react';

interface MAIIconProps {
  size?: number;
  className?: string;
}

const MAIIcon: React.FC<MAIIconProps> = ({ size = 24, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: 'skewX(-10deg)' }}
    >
      <path 
        d="M3 20V4L12 14L21 4V20" 
        stroke="currentColor" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 14L12 21" 
        stroke="currentColor" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        className="opacity-20"
      />
    </svg>
  );
};

export default MAIIcon;