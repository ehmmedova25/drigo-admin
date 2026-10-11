import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

type LinkOwnProps<C extends ElementType> = {
  component?: C;
  className?: string;
};

export type LinkProps<C extends ElementType = 'a'> = LinkOwnProps<C> & Omit<ComponentPropsWithoutRef<C>, keyof LinkOwnProps<C>>;

export const Link = <C extends ElementType = 'a'>({ component, className, ...props }: LinkProps<C>) => {
  const Component = component || 'a';
  return <Component className={cx(styles.root, className)} {...props} />;
};
