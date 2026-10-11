import { useState } from 'react';
import { useGetTicketsQuery } from '@/api/endpoints/supportApi';
import { PagedTable, type Column } from '@/components/common/data-table';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Paragraph } from '@/components/ui/paragraph';
import { Select } from '@/components/ui/select';
import { Span } from '@/components/ui/span';
import { Stack } from '@/components/ui/stack';
import { COMMON_MESSAGES } from '@/constants/messages';
import { TICKET_STATUSES } from '@/constants/support';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { Ticket } from '@/types/support.types';
import { formatDateTime } from '@/utils/format';
import { CustomerContextPanel } from './components/CustomerContextPanel';
import { TicketChat } from './components/TicketChat';
import styles from './style.module.scss';

const columns: Column<Ticket>[] = [
  {
    key: 'customer',
    header: 'Customer',
    render: (t) => (
      <Stack gap="2xs">
        <Stack direction="row" gap="xs" align="center">
          <Span color="var(--text-primary)" weight="500">
            {t.memberName}
          </Span>
          {t.unreadCount > 0 && <Badge tone="danger">{t.unreadCount}</Badge>}
        </Stack>
        <div className={styles.preview}>{t.lastMessage ?? t.reasonName}</div>
      </Stack>
    ),
  },
  { key: 'status', header: 'Status', render: (t) => <StatusBadge status={t.status} /> },
  { key: 'last', header: 'Last', render: (t) => formatDateTime(t.lastMessageAt) },
];

const Support = () => {
  const [status, setStatus] = useState('');
  const list = usePagedQuery(useGetTicketsQuery, { status });
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <>
      <PageHeader title="Support" />
      <div className={styles.layout}>
        <Card>
          <Stack direction="row" gap="xs" align="center" wrap>
            <Select value={status} onChange={setStatus} options={TICKET_STATUSES} placeholder={COMMON_MESSAGES.ALL_STATUSES} />
          </Stack>
          <PagedTable list={list} columns={columns} rowKey={(t) => t.id} onRowClick={(t) => setSelectedId(t.id)} emptyText="No tickets" />
        </Card>
        <Stack gap="md">
          {selectedId ? (
            <>
              <TicketChat key={selectedId} ticketId={selectedId} />
              <CustomerContextPanel ticketId={selectedId} />
            </>
          ) : (
            <Card>
              <Paragraph color="var(--text-muted)">Select a ticket to open the chat.</Paragraph>
            </Card>
          )}
        </Stack>
      </div>
    </>
  );
};

export default Support;
