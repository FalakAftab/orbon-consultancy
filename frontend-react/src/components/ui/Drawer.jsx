import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

export function Drawer({
  isOpen,
  onClose,
  side = 'right',
  title,
  description,
  footer,
  children,
  className,
}) {
  // Escape to close + scroll lock.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'drawer-panel',
          side === 'left' ? 'drawer-left' : 'drawer-right',
          className
        )}
      >
        {(title || true) && (
          <div className="drawer-header">
            <div>
              {title && <h2 className="text-lg font-semibold">{title}</h2>}
              {description && <p className="text-sm text-muted mt-1">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-icon flex-shrink-0"
              aria-label="Close drawer"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-footer">{footer}</div>}
      </div>
    </>,
    document.body
  );
}

export default Drawer;
