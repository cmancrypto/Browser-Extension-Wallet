import React from 'react';
import { cn } from '@/helpers/utils';

interface SeparatorProps {
  showBorder?: boolean;
  variant?: 'top' | 'bottom' | 'neutral';
  className?: string;
}

const variantStyles = {
  top: 'mb-4',
  bottom: 'mt-1 mb-2',
  neutral: '',
};

export const Separator: React.FC<SeparatorProps> = ({
  showBorder = true,
  variant = 'neutral',
  className = '',
}) => {
  return (
    <div
      className={cn(
        `border-b ${showBorder ? 'border-neutral-4' : 'border-transparent'}`,
        variantStyles[variant],
        className,
      )}
    />
  );
};
