import type {
ButtonOnlyIconSize,
ButtonOnlyIconVariant,
ButtonOnlyIconState,
} from './buttonOnlyIcon.type';

export const buttonOnlyIconSizeVariants: Record<ButtonOnlyIconSize, string> = {
sm: 'h-[40px] w-[40px]',
md: 'h-[48px] w-[48px]',
lg: 'h-[56px] w-[56px]',
};

export const buttonOnlyIconBase = `  inline-flex
  items-center
  justify-center
  rounded-full
  transition-all
  duration-200
  focus:outline-none`;

export const buttonOnlyIconVariants: Record<
ButtonOnlyIconVariant,
Record<ButtonOnlyIconState, string>

> = {
 primary: {
 default: `       
       bg-[var(--color-primary-500)]
       text-white
       hover:bg-[var(--color-primary-600)]
       active:bg-[var(--color-primary-400)]
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
    `,
disabled: `       
      bg-[var(--color-Neutral-200)]
      text-white
      cursor-not-allowed
    `,
},

danger: {
default: `       
      bg-danger-500
      text-white
      hover:bg-danger-700
      active:bg-danger-400
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
    `,
disabled: `       border
      border-[var(--border-width-md)]
      border-[var(--color-primary-100)]
      text-[var(--color-primary-100)]
      bg-transparent
      cursor-not-allowed
    `,
},
};
