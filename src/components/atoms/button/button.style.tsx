import type { ButtonSize, ButtonState, ButtonVariant } from './button.type';

const iconGap = `  
  gap-[8px]
  hover:gap-[16px]
  active:gap-[16px]`;

export const buttonSizeVariants: Record<ButtonSize, string> = {
  sm: `     
    h-[40px]
    text-[14px]
  `,
  md: `     
    h-[48px]
    text-[16px]
  `,
  lg: `     
    h-[56px]
    text-[18px]
    text-[var(--font-weight-medium)]
    min-w-[143px]
    hover:min-w-[153px]
  `,
};

export const buttonWidthVariants: Record<ButtonState, string> = {
  default: '',
  disabled: '',
};

export const buttonVariants: Record<ButtonVariant, Record<ButtonState, string>> = {

  primary: {
    default: `    
       bg-[var(--color-primary-500)]
       text-white
       hover:bg-[var(--color-primary-600)]
       active:bg-[var(--color-primary-400)]
       ${iconGap}
     `,
    disabled: `       
       bg-[var(--color-primary-200)]
       text-white
       cursor-not-allowed
     `,
  },

  secondary: {
    default: `       
     bg-secondary-500
      text-white
      hover:bg-[var(--color-secondary-700)]
      active:bg-[var(--color-secondary-400)]
      ${iconGap}
    `,
    disabled: `       
      bg-[var(--color-secondary-200)]
      text-white
      cursor-not-allowed
    `,
  },

  tertiary: {
    default: `       
      text-black
      bg-transparent
      hover:text-neutral-900
      active:text-neutral-800
      ${iconGap}
    `,
    disabled: `       
      text-[var(--color-neutral-600)]
      bg-transparent
      cursor-not-allowed
    `,
  },

  link: {
    default: `       
      text-[var(--color-primary-500)]
      bg-transparent
      hover:text-[var(--color-primary-600)]
      active:text-[var(--color-primary-400)]
      ${iconGap}
    `,
    disabled: `       
      text-[var(--color-primary-200)]
      bg-transparent
      cursor-not-allowed
    `,
  },

  danger: {
    default: `       
    bg-danger-500
      text-white
      hover:bg-danger-700
      active:bg-danger-400
      ${iconGap}
    `,
    disabled: `       
      bg-[var(--color-danger-200)]
      text-white
      cursor-not-allowed
    `,
  },

  outline: {
    default: `       
      border
      border-[var(--border-width-md)]
      border-[var(--color-primary-500)]
      text-[var(--color-primary-500)]
      bg-transparent
      hover:border-[var(--color-primary-600)]
      hover:text-[var(--color-primary-600)]
      active:border-[var(--color-primary-400)]
      active:text-[var(--color-primary-400)]
      ${iconGap}
    `,
    disabled: `       
     border
      border-[var(--border-width-md)]
      border-[var(--color-primary-100)]
      text-[var(--color-primary-100)]
      bg-transparent
      cursor-not-allowed
    `,
  },
};
