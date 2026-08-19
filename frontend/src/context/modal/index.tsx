import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface ModalOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'primary' | 'warning';
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalContextType {
  showModal: (options: ModalOptions) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);

  const showModal = (options: ModalOptions) => {
    setModalOptions(options);
  };

  const hideModal = () => {
    setModalOptions(null);
  };

  const handleConfirm = () => {
    if (modalOptions?.onConfirm) {
      modalOptions.onConfirm();
    }
    hideModal();
  };

  const handleCancel = () => {
    if (modalOptions?.onCancel) {
      modalOptions.onCancel();
    }
    hideModal();
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}

      {/* Global Confirmation Modal Dialog */}
      {modalOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div>
              {modalOptions.title && (
                <h3 className="text-base font-extrabold text-slate-900">
                  {modalOptions.title}
                </h3>
              )}
              {modalOptions.description && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {modalOptions.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-2xl bg-slate-100 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 active:scale-[0.98] transition"
              >
                {modalOptions.cancelText || 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className={`flex-1 rounded-2xl py-3 text-xs font-bold text-white shadow-md active:scale-[0.98] transition ${
                  modalOptions.type === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                }`}
              >
                {modalOptions.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
