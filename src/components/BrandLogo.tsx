import React from 'react';

interface BrandLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
}

export const BrandLogoMark: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <defs>
      <linearGradient id="hdLogoGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#075C45" />
        <stop offset="100%" stopColor="#079669" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="14" fill="url(#hdLogoGrad)" />
    {/* Minimal Home Roofline Outline */}
    <path
      d="M12 21L24 11L36 21"
      stroke="#FFFDF7"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Warm Homemade Food Bowl */}
    <path
      d="M15 25C15 31 19 35 24 35C29 35 33 31 33 25H15Z"
      fill="#FFFDF7"
    />
    <rect x="13.5" y="23" width="21" height="2.5" rx="1.25" fill="#FFFDF7" />
    {/* Botanical Leaf with Subtle Heart Curve (Home + Food + Care) */}
    <path
      d="M24 14C24 14 27.5 17 27.5 19.5C27.5 21 26.2 22 24.8 22C24 22 23.3 21.6 23 21C22.7 21.6 22 22 21.2 22C19.8 22 18.5 21 18.5 19.5C18.5 17 22 14 24 14Z"
      fill="#E8D99A"
    />
    <path d="M24 17.5V22" stroke="#075C45" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  variant = 'dark',
}) => {
  const pixelSize = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;
  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      <div className="group-hover:scale-105 transition-transform duration-300 shadow-garden rounded-2xl">
        <BrandLogoMark size={pixelSize} />
      </div>

      {!iconOnly && (
        <div className="leading-tight min-w-0">
          <span
            className={`block font-display tracking-tight font-extrabold truncate ${
              size === 'sm'
                ? 'text-base sm:text-lg'
                : size === 'lg'
                ? 'text-xl sm:text-2xl'
                : 'text-base sm:text-lg lg:text-xl'
            } ${isLight ? 'text-[#FFFDF7]' : 'text-[#075C45] group-hover:text-[#079669]'}`}
          >
            HOME DELIGHTS
          </span>
          <span
            className={`hidden sm:block text-[10.5px] font-bold -mt-0.5 tracking-wide truncate ${
              isLight ? 'text-[#CDEEDC]' : 'text-[#123F35]/75'
            }`}
          >
            Homemade food. Made with heart.
          </span>
        </div>
      )}
    </div>
  );
};
