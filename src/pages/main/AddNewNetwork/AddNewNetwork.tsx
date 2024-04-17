import React from 'react';
import { NavLink } from 'react-router-dom';

import { ArrowLeft } from '@/assets/icons';
import { ROUTES } from '@/constants';
import { Button, Input } from '@/ui-kit';

export const AddNewNetwork: React.FC = () => (
  <div className="h-full pt-5 px-4 flex flex-col">
    <div className="flex justify-between items-center w-full">
      <NavLink
        to={ROUTES.APP.ROOT}
        className="flex items-center justify-center max-w-5 max-h-5 p-0.5"
      >
        <ArrowLeft className="w-full h-full text-white" />
      </NavLink>
      <h1 className="text-h5 text-white font-bold">Add new network</h1>
      <div className="max-w-5 w-full max-h-5" />
    </div>
    <div className="flex flex-col w-full px-7 pt-6 pb-5 h-full">
      <div className="flex-1">
        <Input className="mb-3" variant="primary" label="Network name" placeholder="Add text" />
        <Input className="mb-3" variant="primary" label="New URL RPC" placeholder="Add text" />
        <Input className="mb-3" variant="primary" label="Blockchain ID" placeholder="Add text" />
        <Input
          className="mb-3"
          variant="primary"
          label="Symbol native coin"
          placeholder="Add text"
        />
        <Input className="mb-3" variant="primary" label="URL explorer" placeholder="Add text" />
      </div>
      <div className="w-full">
        <Button className="w-full">Save</Button>
      </div>
    </div>
  </div>
);
