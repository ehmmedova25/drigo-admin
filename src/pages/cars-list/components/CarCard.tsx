import { CarVisual } from '@/components/common/car-visual';
import { StatusBadge } from '@/components/common/status-badge';
import { Button } from '@/components/ui/button';
import { Span } from '@/components/ui/span';
import type { CarListItem } from '@/types/cars.types';
import { carState } from '@/utils/carState';
import { orDash } from '@/utils/format';
import styles from './CarCard.module.scss';

export interface CarCardProps {
  car: CarListItem;
  onOpen: (id: number) => void;
}

export const CarCard = ({ car, onOpen }: CarCardProps) => {
  return (
    <Button variant="ghost" className={styles.root} onClick={() => onOpen(car.id)}>
      <div className={styles.stage}>
        <StatusBadge status={carState(car.isActive, Boolean(car.activeRentalId))} />
        <CarVisual brand={car.brandName} model={car.modelName} className={styles.car} />
      </div>
      <div className={styles.body}>
        <span className={styles.name}>
          {car.brandName} {car.modelName}
        </span>
        <Span size="13px">
          {car.manufactureYear} · {car.colorName} · {orDash(car.plateNumber)}
        </Span>
        <div className={styles.fuel}>
          <div className={styles.fuelTrack}>
            <div className={styles.fuelFill} style={{ width: `${car.fuelLevel}%` }} />
          </div>
          <Span size="12px" weight="500">
            {car.fuelLevel}%
          </Span>
        </div>
      </div>
    </Button>
  );
};
