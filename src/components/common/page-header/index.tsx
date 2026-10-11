import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Heading } from '@/components/ui/heading';
import { Link } from '@/components/ui/link';
import { Stack } from '@/components/ui/stack';
import styles from './style.module.scss';

export interface PageHeaderProps {
  title: ReactNode;
  back?: { to: string; label: string };
  badge?: ReactNode;
  actions?: ReactNode;
}

export const PageHeader = ({ title, back, badge, actions }: PageHeaderProps) => {
  return (
    <Stack gap="2xs" className={styles.root}>
      {back && (
        <Link component={RouterLink} to={back.to} className={styles.back}>
          {back.label}
        </Link>
      )}
      <Stack direction="row" align="center" justify="between" gap="sm" wrap>
        <Stack direction="row" align="center" gap="sm" wrap>
          <Heading as="h1" size="28px" lineHeight="36px" weight="600" className={styles.title}>
            {title}
          </Heading>
          {badge}
        </Stack>
        {actions && (
          <Stack direction="row" align="center" gap="xs" wrap>
            {actions}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
