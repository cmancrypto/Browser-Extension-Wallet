import './App.css';

import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { AppRouter } from '@/app/Router';
import { Loader } from '@/components';

function App() {
  return (
    <MemoryRouter>
      <Suspense fallback={<Loader />}>
        <AppRouter />
      </Suspense>
    </MemoryRouter>
  );
}

export default App;
