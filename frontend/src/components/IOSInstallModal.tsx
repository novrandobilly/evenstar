import { EvenStarButton } from "./EvenStarButton";

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IOSInstallModal({ isOpen, onClose }: IOSInstallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-raised border border-line rounded-3xl p-6 shadow-2xl relative text-ink animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-surface border border-line flex items-center justify-center p-1.5 shadow-xs">
              <img src="/favicon.svg" alt="Evenstar" className="w-full h-full" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Install Evenstar</h3>
              <p className="text-[12px] text-ink-3">Add to your Home Screen</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-ink-3 hover:text-ink hover:bg-panel transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3.5 my-5 text-sm text-ink-2">
          <div className="flex items-start gap-3 p-3 bg-panel/60 rounded-2xl border border-line/60">
            <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-ace-pale text-ace font-bold flex items-center justify-center text-xs">
              1
            </div>
            <div className="pt-0.5">
              <p className="font-semibold text-ink">
                Tap the Share button
              </p>
              <p className="text-xs text-ink-3 mt-0.5">
                In Safari's toolbar at the bottom or top of your screen.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-panel/60 rounded-2xl border border-line/60">
            <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-ace-pale text-ace font-bold flex items-center justify-center text-xs">
              2
            </div>
            <div className="pt-0.5">
              <p className="font-semibold text-ink">
                Select "Add to Home Screen"
              </p>
              <p className="text-xs text-ink-3 mt-0.5">
                Scroll down in the share sheet options and tap <b>Add to Home Screen</b>.
              </p>
            </div>
          </div>
        </div>

        <EvenStarButton
          variant="solid"
          fullWidth
          size="md"
          onClick={onClose}
          className="mt-2"
        >
          Got it
        </EvenStarButton>
      </div>
    </div>
  );
}
