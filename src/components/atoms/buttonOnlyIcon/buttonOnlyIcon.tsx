'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';
import {
buttonOnlyIconBase,
buttonOnlyIconSizeVariants,
buttonOnlyIconVariants,
} from './buttonOnlyIcon.style';

import type {
ButtonOnlyIconSize,
ButtonOnlyIconVariant,
ButtonOnlyIconState,
} from './buttonOnlyIcon.type';

type Props = {
size?: ButtonOnlyIconSize;
variant?: ButtonOnlyIconVariant;
state?: ButtonOnlyIconState;
onClick?: () => void;
children?: React.ReactNode;
hasIcon?: boolean;
className?: string;
};

const ButtonOnlyIcon: React.FC<Props> = ({
size = 'md',
variant = 'primary',
state = 'default',
hasIcon = true,
onClick,
children,
className,
}) => {
return (
<button
type="button"
onClick={onClick}
disabled={state === 'disabled'}
className={cn(
buttonOnlyIconBase,
buttonOnlyIconSizeVariants[size],
buttonOnlyIconVariants[variant][state],
className,
)}
>
{hasIcon && ( <HugeiconsIcon
       icon={ArrowLeft01Icon}
       size={24}
       color="currentColor"
       strokeWidth={1.5}
     />
)}

  {children}
</button>

);
};

export default ButtonOnlyIcon;
