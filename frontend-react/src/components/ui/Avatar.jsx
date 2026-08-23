import { cn } from '../../lib/cn';
import { initials } from '../../lib/format';

const avatarSizes = {
  sm: 'avatar-sm',
  md: 'avatar-md',
  lg: 'avatar-lg',
  xl: 'avatar-xl',
};

const avatarTones = [
  { background: 'var(--color-primary-600)' },
  { background: 'var(--color-accent-600)' },
  { background: 'var(--color-primary-800)' },
  { background: '#0f766e' },
  { background: '#6d28d9' },
];

export function Avatar({ name = '', src, size = 'md', className, ...props }) {
  const tone = avatarTones[(name.charCodeAt(0) || 0) % avatarTones.length];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('avatar', avatarSizes[size], className)}
        {...props}
      />
    );
  }

  return (
    <span
      className={cn('avatar', avatarSizes[size], className)}
      style={{ background: tone.background }}
      aria-label={name}
      {...props}
    >
      {initials(name)}
    </span>
  );
}

export default Avatar;
