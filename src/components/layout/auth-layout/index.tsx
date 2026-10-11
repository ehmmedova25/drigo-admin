import { Outlet } from 'react-router-dom';
import { Heading } from '@/components/ui/heading';
import { Paragraph } from '@/components/ui/paragraph';
import { CAR_PHOTO } from '@/constants/config';
import { useImageFallback } from '@/hooks/useImageFallback';
import { toCarPhotoPaths } from '@/utils/carPhoto';
import styles from './style.module.scss';

export const AuthLayout = () => {
  const photo = useImageFallback(toCarPhotoPaths(CAR_PHOTO.welcome));

  return (
    <div className={styles.root}>
      <section className={styles.panel}>
        <div className={styles.brand}>
          DRIGO
          <span className={styles.brandTag}>Admin</span>
        </div>
        {photo.src && <img src={photo.src} alt="" className={styles.photo} onError={photo.onError} />}
        <div className={styles.panelText}>
          <Heading size="36px" lineHeight="44px" color="var(--text-on-brand)" className={styles.panelTitle}>
            Rentals, fleet and customers in one place.
          </Heading>
          <Paragraph size="16px" lineHeight="24px" color="var(--on-brand-muted)">
            Sign in with your admin account to manage DRIGO.
          </Paragraph>
        </div>
      </section>
      <section className={styles.formSide}>
        <div className={styles.card}>
          <Outlet />
        </div>
      </section>
    </div>
  );
};
