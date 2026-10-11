import { Link as RouterLink } from 'react-router-dom';
import { Heading } from '@/components/ui/heading';
import { Paragraph } from '@/components/ui/paragraph';
import { CAR_PHOTO } from '@/constants/config';
import { ROUTES } from '@/constants/paths';
import { useAuth } from '@/hooks/useAuth';
import { useImageFallback } from '@/hooks/useImageFallback';
import { toCarPhotoPaths } from '@/utils/carPhoto';
import styles from './WelcomeBanner.module.scss';

export interface WelcomeBannerProps {
  activeRentals: number;
  availableCars: number;
}

export const WelcomeBanner = ({ activeRentals, availableCars }: WelcomeBannerProps) => {
  const { admin } = useAuth();
  const firstName = admin?.fullName.split(' ')[0];
  const photo = useImageFallback(toCarPhotoPaths(CAR_PHOTO.welcome));

  return (
    <section className={styles.root}>
      <div className={styles.text}>
        <Heading as="h2" size="28px" lineHeight="36px" color="var(--text-on-brand)">
          Welcome back, {firstName}
        </Heading>
        <Paragraph size="15px" lineHeight="22px" color="var(--on-brand-muted)">
          {activeRentals} active rentals on the road and {availableCars} cars ready to go.
        </Paragraph>
        <div className={styles.actions}>
          <RouterLink to={ROUTES.RENTALS} className={styles.primaryAction}>
            View rentals
          </RouterLink>
          <RouterLink to={ROUTES.TRACKING} className={styles.secondaryAction}>
            Live map
          </RouterLink>
        </div>
      </div>
      {photo.src && <img src={photo.src} alt="" className={styles.photo} onError={photo.onError} />}
    </section>
  );
};
