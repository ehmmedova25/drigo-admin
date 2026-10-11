import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { TIMING } from '@/constants/config';
import { ToastContext, type ToastApi } from '@/hooks/useToast';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

interface ToastItem {
  id: number;
  message: string;
  kind: 'success' | 'error';
}

let nextId = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, kind: ToastItem['kind']) => {
    const id = ++nextId;
    setToasts((list) => [...list, { id, message, kind }]);
    setTimeout(() => setToasts((list) => list.filter((toast) => toast.id !== id)), TIMING.toastMs);
  }, []);

  const api = useMemo<ToastApi>(() => ({ success: (message) => show(message, 'success'), error: (message) => show(message, 'error') }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={styles.root} role="status">
        {toasts.map((toast) => (
          <div key={toast.id} className={cx(styles.toast, styles[toast.kind])}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
