import { useInView } from '../../hooks/useReveal';
import { cn } from '../../lib/cn';

export function Reveal({ children, className, delay = 0, variant = 'up', as: Tag = 'div' }) {
  const { ref, inView } = useInView();

  return (
    <Tag
      ref={ref}
      style={{ ['--reveal-delay']: `${delay}ms` }}
      className={cn(
        variant === 'up' ? 'lp-reveal' : 'lp-reveal-soft',
        inView && 'lp-is-visible',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
