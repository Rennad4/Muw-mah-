import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'inverted';
  hideText?: boolean;
  pulseAnimation?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'default',
  hideText = false,
  pulseAnimation = false,
  className = '',
}) => {
  // Sizing definitions
  const badgeSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const subtextSizes = {
    sm: 'text-[9px] tracking-wider',
    md: 'text-[11px] tracking-widest',
    lg: 'text-xs tracking-widest',
    xl: 'text-sm tracking-widest',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Circular Badge Icon */}
      <div
        className={`relative ${badgeSizes[size]} rounded-full flex items-center justify-center shadow-subtle shrink-0 ${
          pulseAnimation ? 'animate-pulse' : ''
        }`}
        style={{
          backgroundColor: '#0F6E56',
        }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Circular mask for crisp alignment */}
          <g>
            {/* LEFT HALF: Simplified flat Gear / Cog shape (representing Academic Skills & Knowledge) */}
            <g transform="translate(0, 0)">
              {/* Central gear wheel core */}
              <circle cx="21" cy="32" r="7" stroke="white" strokeWidth="2.5" fill="none" />
              <circle cx="21" cy="32" r="2.8" fill="white" />
              {/* Gear Teeth on left side */}
              <rect x="7" y="30.5" width="4.5" height="3" rx="1" fill="white" />
              <rect x="29" y="30.5" width="2" height="3" rx="0.8" fill="white" opacity="0.4" />
              <rect x="19.5" y="18" width="3" height="4.5" rx="1" fill="white" />
              <rect x="19.5" y="41.5" width="3" height="4.5" rx="1" fill="white" />
              {/* Diagonal teeth */}
              <rect x="11.5" y="21.5" width="4" height="2.6" rx="1" transform="rotate(45 11.5 21.5)" fill="white" />
              <rect x="13.5" y="41" width="4" height="2.6" rx="1" transform="rotate(-45 13.5 41)" fill="white" />
            </g>

            {/* SEPARATING CORAL LINE */}
            <line
              x1="32"
              y1="13"
              x2="32"
              y2="51"
              stroke="#D85A30"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* RIGHT HALF: 3 Ascending Bar-Chart Columns + Upward Arrow (Job Market Demand) */}
            <g transform="translate(0, 0)">
              {/* Bar 1 (Shortest) */}
              <rect x="36.5" y="35" width="4.5" height="13" rx="1.5" fill="white" />
              {/* Bar 2 (Medium) */}
              <rect x="43.5" y="28" width="4.5" height="20" rx="1.5" fill="white" />
              {/* Bar 3 (Tallest) */}
              <rect x="50.5" y="21" width="4.5" height="27" rx="1.5" fill="white" />
              {/* Upward Arrow on top of highest column */}
              <path
                d="M52.75 13.5L56 18H49.5L52.75 13.5Z"
                fill="white"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* Brand Typography (Wordmark + Latin subtext) */}
      {!hideText && (
        <div className="flex flex-col text-right">
          <span
            className={`font-bold font-arabic leading-tight ${titleSizes[size]} ${
              variant === 'inverted' ? 'text-white' : 'text-[#085041]'
            }`}
          >
            مواءمة
          </span>
          <span
            className={`font-sans font-medium uppercase ${subtextSizes[size]} ${
              variant === 'inverted' ? 'text-emerald-200/80' : 'text-[#5F5E5A]'
            }`}
          >
            Muwāmah
          </span>
        </div>
      )}
    </div>
  );
};
