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
          <div className="min-h-dvh w-full court-pattern court-lines-overlay flex justify-center text-slate-900 antialiased font-sans">
            {/* Container with ONLY left & right side borders on desktop */}
            <div className="w-full max-w-md min-h-dvh bg-[#fcfbf7] border-0 sm:border-x sm:border-[#ded7c4] shadow-2xl sm:shadow-[0_0_50px_rgba(0,0,0,0.4),0_0_30px_rgba(180,225,0,0.05)] flex flex-col relative selection:bg-volt-500 selection:text-court-950">
              <AppRoutes />
            </div>
          </div>
        </SessionProvider>
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;
