import type { ReactNode } from 'react';

export type SignButtonProps = {
  text: string;
  icon?: ReactNode;
  onClick?: () => void;
};
