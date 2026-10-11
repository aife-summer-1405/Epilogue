import type { HomeLogoProps } from './home-logo.types';
import { homeLogoStyles } from './home-logo.styles';

export default function HomeLogo({ className = '' }: HomeLogoProps) {
  return (
    <div className={`${homeLogoStyles.container} ${className}`}>
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={homeLogoStyles.logo}
        aria-hidden="true"
      >
        <path
          d="M8 27C22 24 34 12 37 3"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M8 16C16 14 24 8 27 3"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M8 38C29 34 44 19 48 3"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M48 5H59V21M8 43V59H26"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28 42L49 28L70 42V67H28V42Z"
          fill="#2447BD"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinejoin="round"
        />
      </svg>

      <span className={homeLogoStyles.text}>Home</span>
    </div>
  );
}