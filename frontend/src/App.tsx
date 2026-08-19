import { BrowserRouter } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import { ModalProvider } from './context/modal';
import { AppRoutes } from './routes';

export function App() {
  return (
    <BrowserRouter>
      <ModalProvider>
        <SessionProvider>
          <AppRoutes />
        </SessionProvider>
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;
