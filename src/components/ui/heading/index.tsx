import type { CSSProperties, ReactNode } from 'react';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps {
  as?: HeadingTag;
  children: ReactNode;
  color?: string;
  align?: CSSProperties['textAlign'];
  weight?: CSSProperties['fontWeight'];
  size?: CSSProperties['fontSize'];
  lineHeight?: CSSProperties['lineHeight'];
  className?: string;
}

export const Heading = ({
  as: Tag = 'h2',
  children,
  color = 'var(--text-primary)',
  align,
  weight = '600',
  size = '22px',
  lineHeight = '28px',
  className,
}: HeadingProps) => {
  return (
    <Tag
      className={className}
      style={{
        fontFamily: 'var(--heading-font-family)',
        color,
        textAlign: align,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
      }}
    >
      {children}
    </Tag>
  );
};
