import { useEffect, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

export const Modal = ({ title, onClose, children, footer, wide }: ModalProps) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={cx(styles.root, wide && styles.wide)}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <Heading as="h3" size="17px" lineHeight="24px" weight="500">
            {title}
          </Heading>
          <Button variant="text" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};
