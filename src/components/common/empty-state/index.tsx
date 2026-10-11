import { Paragraph } from '@/components/ui/paragraph';
import { COMMON_MESSAGES } from '@/constants/messages';
import styles from './style.module.scss';

export const EmptyState = ({ text = COMMON_MESSAGES.EMPTY }: { text?: string }) => {
  return (
    <div className={styles.root}>
      <Paragraph align="center" color="var(--text-muted)">
        {text}
      </Paragraph>
    </div>
  );
};
