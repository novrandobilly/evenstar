import { BrowserRouter } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import { AppRoutes } from './routes';

export function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AppRoutes />
      </SessionProvider>
    </BrowserRouter>
  );
}

export default App;
