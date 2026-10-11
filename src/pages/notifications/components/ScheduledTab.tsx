import { useDeleteScheduledNotificationMutation, useGetScheduledNotificationsQuery } from '@/api/endpoints/notificationsApi';
import { CrudTable } from '@/components/common/crud-table';
import { Span } from '@/components/ui/span';
import { formatDateTime } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { ScheduledFormModal } from './NotificationFormModals';
import styles from './ScheduledTab.module.scss';

export const ScheduledTab = () => {
  const list = toListState(useGetScheduledNotificationsQuery());
  const [deleteScheduledNotification] = useDeleteScheduledNotificationMutation();

  return (
    <CrudTable
      list={list}
      entity="scheduled notification"
      rowKey={(notification) => notification.id}
      nameOf={(notification) => notification.title}
      columns={[
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
        { key: 'audience', header: 'Audience', render: (notification) => notification.targetAudience },
        { key: 'at', header: 'Send at', render: (notification) => formatDateTime(notification.scheduledAt) },
      ]}
      renderForm={(props) => <ScheduledFormModal {...props} />}
      editable={false}
      onDelete={(notification) => deleteScheduledNotification(notification.id).unwrap()}
    />
  );
};
