import { CarVisual } from '@/components/common/car-visual';
import { Span } from '@/components/ui/span';
import { TRANSMISSIONS } from '@/constants/cars';
import type { CarDetail } from '@/types/cars.types';
import { formatMoney, formatNumber, orDash } from '@/utils/format';
import styles from './CarHero.module.scss';

export interface CarHeroProps {
  car: CarDetail;
}

export const CarHero = ({ car }: CarHeroProps) => {
  const specs = [
    { label: 'Body', value: car.bodyType },
    { label: 'Seats', value: car.seats },
    { label: 'Transmission', value: orDash(TRANSMISSIONS.find((t) => t.value === car.transmission)?.label) },
    { label: 'Max speed', value: `${car.maxSpeed} km/h` },
    { label: 'Fuel', value: `${car.fuelTypeName} · ${car.fuelLevel}%` },
    { label: 'Odometer', value: `${formatNumber(car.distance)} km` },
  ];

  return (
    <section className={styles.root}>
      <div className={styles.stage}>
        <span className={styles.plate}>{orDash(car.plateNumber)}</span>
        <CarVisual brand={car.brandName} model={car.modelName} photoUrl={car.mediumUrl} className={styles.car} />
      </div>
      <div className={styles.side}>
        <div className={styles.summary}>
          <Span size="13px">
            {car.manufactureYear} · {car.colorName}
          </Span>
          <span className={styles.price}>{formatMoney(car.price)}</span>
        </div>
        <div className={styles.specs}>
          {specs.map((spec) => (
            <div key={spec.label} className={styles.spec}>
              <Span size="12px">{spec.label}</Span>
              <span className={styles.specValue}>{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
