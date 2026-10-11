import { Paragraph } from '@/components/ui/paragraph';
import { Span } from '@/components/ui/span';
import { Stack } from '@/components/ui/stack';
import styles from './PhotoRow.module.scss';

export interface PhotoRowProps {
  title: string;
  urls: string[] | null;
}

export const PhotoRow = ({ title, urls }: PhotoRowProps) => {
  return (
    <Stack gap="xs">
      <Paragraph color="var(--text-muted)">{title}</Paragraph>
      <div className={styles.photos}>
        {urls?.length ? (
          urls.map((url) => <img key={url} className={styles.photo} src={url} alt={title} loading="lazy" />)
        ) : (
          <Span color="var(--text-muted)">None</Span>
        )}
      </div>
    </Stack>
  );
};
