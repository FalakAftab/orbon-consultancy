import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Landing CTA. Uses react-router Link for internal routes, or renders an anchor
 * for in-page hash targets.
 */
export function Cta({ children, variant = 'solid', withArrow, className, to, href }) {
  const classes = cn(
    'lp-cta',
    variant === 'solid' ? 'lp-cta-solid' : 'lp-cta-outline',
    className,
  );

  const inner = (
    <>
      {children}
      {withArrow && (
        <ArrowRight className="lp-cta-arrow" size={16} aria-hidden="true" />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <a href={href || '#get-started'} className={classes}>
      {inner}
    </a>
  );
}
