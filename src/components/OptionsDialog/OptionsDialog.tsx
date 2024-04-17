import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { ArrowLeft, DotsVertical, Expand, Security, Support } from '@/assets/icons';
import { Button, DialogContent } from '@/ui-kit';

export const OptionsDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-[7px]" variant="icon" size="rounded-default">
          <DotsVertical width="100%" height="100%" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <h3 className="text-h5 font-bold">Options</h3>
        <div className="grid">
          <NavLink
            to={'/'}
            className="flex items-center text-sm text-white font-normal py-3 not-last:border-b not-last:border-neutral-4 hover:text-white"
          >
            <div className="h-8 w-8 bg-blue rounded-full flex items-center justify-center p-1.5 mr-2.5 text-black">
              <Expand />
            </div>
            Expand view
            <div className="flex-1" />
            <ArrowLeft className="rotate-180 h-3 w-3" />
          </NavLink>
          <NavLink
            to={'/'}
            className="flex items-center text-sm text-white font-normal py-3 not-last:border-b not-last:border-neutral-4 hover:text-white"
          >
            <div className="h-8 w-8 bg-blue rounded-full flex items-center justify-center p-1.5 mr-2.5 text-black">
              <Support />
            </div>
            Support
            <div className="flex-1" />
            <ArrowLeft className="rotate-180 h-3 w-3" />
          </NavLink>
          <NavLink
            to={'/'}
            className="flex items-center text-sm text-white font-normal py-3 not-last:border-b not-last:border-neutral-4 hover:text-white"
          >
            <div className="h-8 w-8 bg-blue rounded-full flex items-center justify-center p-1.5 mr-2.5 text-black">
              <Security />
            </div>
            Security
            <div className="flex-1" />
            <ArrowLeft className="rotate-180 h-3 w-3" />
          </NavLink>
        </div>
      </DialogContent>
    </Dialog>
  );
};
