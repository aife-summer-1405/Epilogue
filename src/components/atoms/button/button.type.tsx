import type {
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from 'react';

export type ButtonState = 'default' | 'disabled';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'link'
  | 'danger'
  | 'tertiary';

export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'style' | 'className'
  > {
  state?: ButtonState;
  size?: ButtonSize;
  variant?: ButtonVariant;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  hasIcon?: boolean;
  className?: string;
  style?: CSSProperties;
}