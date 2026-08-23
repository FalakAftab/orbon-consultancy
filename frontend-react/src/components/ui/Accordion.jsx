import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

export function Accordion({ children, className, ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function AccordionItem({ value, title, children, defaultOpen = false, className }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('accordion-item', className)}>
      <button
        type="button"
        className="accordion-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          className="transition-transform"
        />
      </button>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
}

export default Accordion;
