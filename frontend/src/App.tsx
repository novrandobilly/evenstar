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
          <div className="min-h-dvh w-full bg-slate-100 flex justify-center text-slate-900 antialiased font-sans">
            <div className="w-full max-w-md min-h-dvh bg-slate-50 sm:border-x sm:border-slate-200 sm:shadow-xl flex flex-col relative">
              <AppRoutes />
            </div>
          </div>
        </SessionProvider>
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;
