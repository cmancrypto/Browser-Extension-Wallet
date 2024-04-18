import './App.css';

import { MemoryRouter } from 'react-router-dom';

import { AppRouter } from '@/app/Router';

function App() {
  return (
    <MemoryRouter>
      <AppRouter />
    </MemoryRouter>
  );
}

export default App;
