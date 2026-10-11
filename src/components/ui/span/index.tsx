import type { CSSProperties, ReactNode } from 'react';

export interface SpanProps {
  children: ReactNode;
  color?: string;
  weight?: CSSProperties['fontWeight'];
  size?: CSSProperties['fontSize'];
  lineHeight?: CSSProperties['lineHeight'];
  className?: string;
}

export const Span = ({ children, color = 'var(--text-secondary)', weight, size, lineHeight, className }: SpanProps) => {
  return (
    <span className={className} style={{ color, fontWeight: weight, fontSize: size, lineHeight }}>
      {children}
    </span>
  );
};
