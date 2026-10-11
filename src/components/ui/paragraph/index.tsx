import type { CSSProperties, ReactNode } from 'react';

export interface ParagraphProps {
  children: ReactNode;
  color?: string;
  align?: CSSProperties['textAlign'];
  weight?: CSSProperties['fontWeight'];
  size?: CSSProperties['fontSize'];
  lineHeight?: CSSProperties['lineHeight'];
  className?: string;
}

export const Paragraph = ({
  children,
  color = 'var(--text-secondary)',
  align,
  weight = '400',
  size = '14px',
  lineHeight = '20px',
  className,
}: ParagraphProps) => {
  return (
    <p
      className={className}
      style={{
        fontFamily: 'var(--paragraph-font-family)',
        color,
        textAlign: align,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
      }}
    >
      {children}
    </p>
  );
};
