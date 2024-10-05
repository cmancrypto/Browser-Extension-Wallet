import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { cn } from '@/helpers/utils';
import { X } from '@/assets/icons'; // Your close icon
import { Button } from '../Button';

interface SlideTrayProps {
  triggerComponent: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  className?: string;
  closeButtonVariant?: 'top-right' | 'bottom-center';
  height?: string;
}

export const SlideTray: React.FC<SlideTrayProps> = ({
  triggerComponent,
  title,
  children,
  className,
  closeButtonVariant = 'top-right',
  height = '75%',
}) => {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>{triggerComponent}</DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-background-dialog-overlay',
            'data-[state=open]:animate-fade-in-0 data-[state=closed]:animate-fade-out-0',
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50 w-full mx-auto p-6 bg-background-dialog-bg rounded-t-2xl',
            'data-[state=open]:animate-slide-in-from-bottom data-[state=closed]:animate-slide-out-to-bottom',
            className,
          )}
          style={{ height }}
        >
          <div className="relative">
            {title && <h2 className="text-h5 font-bold text-center mb-2">{title}</h2>}
            <div className="mt-4">{children}</div>
            {closeButtonVariant === 'top-right' && (
              <DialogPrimitive.Close className="absolute right-4 top-4 focus:outline-none">
                <X width={18} height={18} />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
            {closeButtonVariant === 'bottom-center' && (
              <div className="flex justify-center mt-4">
                <DialogPrimitive.Close asChild>
                  <Button className="w-[56%] py-3 rounded-full text-lg">Close</Button>
                </DialogPrimitive.Close>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
