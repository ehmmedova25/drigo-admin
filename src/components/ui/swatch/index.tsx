import styles from './style.module.scss';

export interface SwatchProps {
  color?: string;
}

export const Swatch = ({ color }: SwatchProps) => {
  return <span className={styles.root} style={{ background: color }} />;
};
