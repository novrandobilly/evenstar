import {
  createContext,
  useCallback,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  isVisible: boolean;
  isLeaving: boolean;
}

interface ToastContextType {
  showToast: (options: { message: string; type?: ToastType }) => void;
  showGeneralErrorToast: (message?: string) => void;
}

interface ToastProviderProps {
  children: ReactNode;
  slideDurationMs?: number;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: FC<ToastProviderProps> = ({
  children,
  slideDurationMs = 300,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const EXIT_DURATION_MS = Math.max(0, slideDurationMs);
  const AUTO_REMOVE_MS = 4000;

  const removeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isLeaving: true, isVisible: false } : t,
      ),
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_DURATION_MS);
  }, [EXIT_DURATION_MS]);

  const showToast = useCallback(
    ({ message, type = "success" }: { message: string; type?: ToastType }) => {
      const id = crypto.randomUUID();

      setToasts((prev) => [
        ...prev,
        { id, message, type, isVisible: false, isLeaving: false },
      ]);

      requestAnimationFrame(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isVisible: true } : t)),
        );
      });

      setTimeout(() => {
        removeToast(id);
      }, AUTO_REMOVE_MS);
    },
    [removeToast],
  );

  const showGeneralErrorToast = useCallback(
    (message?: string) => {
      showToast({
        message: message || "An unexpected error occurred. Please try again.",
        type: "error",
      });
    },
    [showToast],
  );

  return (
    <ToastContext.Provider value={{ showToast, showGeneralErrorToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              pointer-events-auto flex items-center justify-between gap-3 
              px-4 py-3 rounded-2xl shadow-xl text-white font-sans text-xs font-bold
              backdrop-blur-md transition-all ease-out border border-white/15
              ${t.isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"}
              ${
                t.type === "success"
                  ? "bg-court-850 text-volt-300 border-court-700/50"
                  : t.type === "error"
                    ? "bg-rose-900 text-rose-100 border-rose-700/50"
                    : "bg-slate-900 text-slate-100 border-slate-700/50"
              }
            `}
            style={{ transitionDuration: `${slideDurationMs}ms` }}
          >
            <p className="flex-1 leading-snug">{t.message}</p>

            <button
              type="button"
              onClick={() => {
                if (!t.isLeaving) removeToast(t.id);
              }}
              className="hover:bg-white/20 p-1 rounded-lg transition-colors cursor-pointer text-white/70 hover:text-white"
              aria-label="Close notification"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
