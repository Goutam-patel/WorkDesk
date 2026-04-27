'use client';

import { useEffect, useRef, useState } from 'react';

export default function Dropdown({ label = 'Actions', items = [] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function onClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        onClick={() => setOpen((prev) => !prev)}
      >
        {label}
      </button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 min-w-32 overflow-hidden rounded-xl border border-white/10 bg-[rgba(10,10,15,0.98)] shadow-2xl backdrop-blur">
          {items.map((item, index) => (
            item.kind === 'divider' ? (
              <div key={`divider-${index}`} className="my-1 border-t border-white/10" />
            ) : (
              <button
                key={item.label}
                className={`block w-full px-3 py-2 text-left text-sm transition ${item.onClick ? 'hover:bg-white/5' : 'cursor-default opacity-70'} ${item.tone === 'danger' ? 'text-[color:var(--danger)]' : 'text-slate-200'}`}
                disabled={!item.onClick}
                onClick={() => {
                  if (!item.onClick) {
                    return;
                  }
                  setOpen(false);
                  item.onClick();
                }}
              >
                {item.label}
              </button>
            )
          ))}
        </div>
      ) : null}
    </div>
  );
}
