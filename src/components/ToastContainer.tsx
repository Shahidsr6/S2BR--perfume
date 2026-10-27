import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#2b2a28] text-[#e6e1df] border border-[#f2ca50]/40 px-5 py-3.5 shadow-2xl flex items-center gap-3 min-w-[280px] max-w-md animate-slideUp"
        >
          <span className="material-symbols-outlined text-[#f2ca50] text-[22px] shrink-0">
            {toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'task_alt'}
          </span>
          <div className="flex-grow">
            <div className="font-title-sc text-[11px] text-[#f2ca50] uppercase tracking-wider">
              {toast.type === 'error' ? 'Attention' : 'S2BR Atelier'}
            </div>
            <div className="font-body-sm text-[12px] text-[#e6e1df] mt-0.5 leading-snug">
              {toast.message}
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#99907c] hover:text-[#f2ca50] p-1 shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
