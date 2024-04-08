import React, { ComponentType } from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => (
  <div>
    <Outlet />
  </div>
);

export default MainLayout as ComponentType;
