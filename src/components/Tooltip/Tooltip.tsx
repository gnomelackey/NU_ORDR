import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import "./Tooltip.css";

type TooltipProps = {
  content: string;
  children: ReactNode;
  className?: string;
};

export function Tooltip({ content, children, className = "" }: TooltipProps) {
  const anchorRef = useRef<HTMLSpanElement | null>(null);

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    const el = anchorRef.current;
    
    if (!el) return;

    const rect = el.getBoundingClientRect();

    setPosition({
      top: rect.top - 12,
      left: rect.left + rect.width / 2,
    });
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handle = () => updatePosition();
    window.addEventListener("scroll", handle, true);
    window.addEventListener("resize", handle);

    return () => {
      window.removeEventListener("scroll", handle, true);
      window.removeEventListener("resize", handle);
    };
  }, [open]);

  return (
    <span
      className={`tooltip ${className}`.trim()}
      ref={anchorRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open
        ? createPortal(
            <span
              className="tooltip-bubble"
              role="tooltip"
              style={{ top: position.top, left: position.left }}
            >
              {content}
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}
