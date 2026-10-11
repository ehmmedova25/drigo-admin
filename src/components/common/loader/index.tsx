import { Span } from '@/components/ui/span';
import { Spinner } from '@/components/ui/spinner';
import { Stack } from '@/components/ui/stack';
import { COMMON_MESSAGES } from '@/constants/messages';
import styles from './style.module.scss';

export const Loader = ({ text = COMMON_MESSAGES.LOADING }: { text?: string }) => {
  return (
    <Stack direction="row" align="center" justify="center" gap="xs" className={styles.root}>
      <Spinner />
      <Span>{text}</Span>
    </Stack>
  );
};
