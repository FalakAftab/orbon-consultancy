import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Lightweight tooltip. Renders a positioned label on hover/focus.
 * Optional `side` (top/bottom/left/right) placement.
 */
export function Tooltip({ content, children, side = 'top', className }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);

  const show = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offset = 8;
    let x = rect.left + rect.width / 2;
    let y = rect.top;
    if (side === 'top') y = rect.top - offset;
    if (side === 'bottom') y = rect.bottom + offset;
    if (side === 'left') {
      x = rect.left - offset;
      y = rect.top + rect.height / 2;
    }
    if (side === 'right') {
      x = rect.right + offset;
      y = rect.top + rect.height / 2;
    }
    setPosition({ x, y });
    setVisible(true);
  };

  const hide = () => setVisible(false);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="inline-flex"
      >
        {children}
      </span>
      {visible &&
        createPortal(
          <span
            className={`tooltip ${className || ''}`}
            style={{
              left: side === 'left' || side === 'right' ? position.x : '50%',
              top: position.y,
              transform:
                side === 'top' || side === 'bottom'
                  ? 'translateX(-50%)'
                  : side === 'left'
                  ? 'translateY(-50%) translateX(-100%)'
                  : 'translateY(-50%)',
            }}
          >
            {content}
          </span>,
          document.body
        )}
    </>
  );
}

export default Tooltip;
