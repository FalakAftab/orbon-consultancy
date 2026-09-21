import React from 'react';

/**
 * Decorative Background Image Component
 * Renders a gorgeous faded background image of a university to fill empty spaces beautifully,
 * based on user feedback to use a real image watermark instead of thin SVG lines.
 */
export function DecorativeLineArt({
  opacity = 0.04,
  style = {},
  className = ''
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        ...style
      }}
      className={className}
    >
      <img 
        src="/hero-university.jpg" 
        alt="" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: opacity,
          mixBlendMode: 'multiply',
          filter: 'grayscale(80%) sepia(30%) contrast(120%)',
          transform: 'scale(1.05)'
        }}
      />
    </div>
  );
}
