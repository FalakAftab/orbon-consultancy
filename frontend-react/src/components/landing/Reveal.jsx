import { useInView } from '../../hooks/useReveal';
import { cn } from '../../lib/cn';

export function Reveal({
  children,
  className,
  delay = 0,
  variant = 'up',
  as: Tag = 'div',
  style = {},
  ...props
}) {
  const { ref, inView } = useInView();

  const variantClass =
    variant === 'left'
      ? 'lp-reveal-left'
      : variant === 'right'
      ? 'lp-reveal-right'
      : variant === 'scale'
      ? 'lp-reveal-scale'
      : variant === 'soft'
      ? 'lp-reveal-soft'
      : 'lp-reveal';

  return (
    <Tag
      ref={ref}
      style={{
        '--lp-reveal-delay': `${delay}ms`,
        '--reveal-delay': `${delay}ms`,
        ...style,
      }}
      className={cn(
        variantClass,
        inView && 'lp-is-visible',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
