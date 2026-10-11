import { useImageFallback } from '@/hooks/useImageFallback';
import { toModelPhotoPaths } from '@/utils/carPhoto';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export interface CarVisualProps {
  brand: string;
  model: string;
  photoUrl?: string | null;
  compact?: boolean;
  className?: string;
}

export const CarVisual = ({ brand, model, photoUrl, compact = false, className }: CarVisualProps) => {
  const { src, onError } = useImageFallback([...toModelPhotoPaths(brand, model), photoUrl]);

  if (!src) {
    return (
      <div className={cx(styles.root, styles.placeholder, className)}>
        {compact ? (
          <span className={styles.initial}>{brand.charAt(0)}</span>
        ) : (
          <>
            <span className={styles.brand}>{brand}</span>
            <span className={styles.model}>{model}</span>
          </>
        )}
      </div>
    );
  }

  return <img src={src} alt={`${brand} ${model}`} className={cx(styles.root, className)} onError={onError} />;
};
