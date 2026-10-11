import { Link as RouterLink } from 'react-router-dom';
import { useGetNotificationHistoryQuery } from '@/api/endpoints/notificationsApi';
import { PagedTable } from '@/components/common/data-table';
import { StatusBadge } from '@/components/common/status-badge';
import { Card } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { Span } from '@/components/ui/span';
import { HISTORY_PAGE_SIZE } from '@/constants/notifications';
import { ROUTES } from '@/constants/paths';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import { formatDateTime } from '@/utils/format';
import styles from './HistoryTab.module.scss';

export const HistoryTab = () => {
  const list = usePagedQuery(useGetNotificationHistoryQuery, {}, HISTORY_PAGE_SIZE);

  return (
    <Card>
      <PagedTable
        list={list}
        rowKey={(notification) => notification.id}
        emptyText="Nothing sent yet"
        columns={[
          { key: 'at', header: 'Sent', render: (notification) => formatDateTime(notification.createdAt) },
          { key: 'title', header: 'Title', render: (notification) => notification.title },
          {
            key: 'body',
            header: 'Message',
            render: (notification) => (
              <Span className={styles.ellipsis} color="inherit">
                {notification.body}
              </Span>
            ),
          },
          { key: 'type', header: 'Type', render: (notification) => notification.type },
          {
            key: 'to',
            header: 'To',
            render: (notification) =>
              notification.targetUserId ? (
                <Link component={RouterLink} to={ROUTES.CUSTOMER(notification.targetUserId)}>
                  Customer
                </Link>
              ) : (
                'Audience'
              ),
          },
          { key: 'channel', header: 'Channel', render: (notification) => notification.channel },
          { key: 'status', header: 'Status', render: (notification) => <StatusBadge status={notification.status} /> },
        ]}
      />
    </Card>
  );
};
