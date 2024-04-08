import { ClassValue } from 'clsx';
import * as React from 'react';
import { ReactNode } from 'react';

import { cn } from '@/helpers/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'unstyled';
  label?: string;
  error?: boolean;
  errorText?: string;
  icon?: ReactNode;
  wrapperClass?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant, className, type, label, error, errorText, icon, wrapperClass, ...props }, ref) => {
    switch (variant) {
      case 'primary': {
        return (
          <div className={cn('text-left relative', wrapperClass as string)}>
            {label && <label className="block mb-1.5 text-base text-white">{label}</label>}
            <input
              type={type}
              className={cn(
                'flex h-12 w-full rounded-lg border border-neutral-3 bg-transparent px-3 py-3.5 text-base text-neutral-3',
                'hover:border-neutral-1 hover:text-neutral-1',
                'focus:outline-0 focus:border-blue focus:text-white',
                !!error &&
                  'border-error-red text-error-red hover:border-error-red hover:text-error-red focus:border-error-red focus:text-error-red',
                !!icon && 'pr-11.5',
                className as ClassValue,
              )}
              ref={ref}
              {...props}
            />
            {icon && (
              <div
                role="button"
                className={cn(
                  `absolute ${label ? 'top-[34px]' : 'top-3'} right-3 w-6 h-6 flex items-center justify-center`,
                  'text-neutral-3 hover:text-neutral-1 focus:text-white',
                  !!error && 'text-error-red hover:text-error-red focus:text-error-red',
                )}
              >
                {icon}
              </div>
            )}
            {errorText && <span className="mt-1.5 text-small text-error-red">{errorText}</span>}
          </div>
        );
      }
      default: {
        return <input className={cn('bg-transparent', className as string)} ref={ref} {...props} />;
      }
    }
  },
);
Input.displayName = 'Input';
