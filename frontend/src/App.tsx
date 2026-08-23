import { BrowserRouter } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import { ModalProvider } from './context/modal';
import { AppRoutes } from './routes';
import ScrollToTop from './components/ScrollToTop';

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ModalProvider>
        <SessionProvider>
          <AppRoutes />
        </SessionProvider>
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;
