'use client';

import { useEffect } from 'react';
import clsx from 'clsx';

export default function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (open) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div className={clsx('animate-slideInFromBottom glass relative z-10 w-full rounded-2xl p-5 shadow-2xl', width)}>
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white" onClick={onClose} aria-label="Close modal">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
