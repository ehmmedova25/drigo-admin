import {
  useDeleteCampaignMutation,
  useExecuteCampaignMutation,
  useGetCampaignsQuery,
  useSetCampaignStatusMutation,
} from '@/api/endpoints/notificationsApi';
import { CrudTable } from '@/components/common/crud-table';
import { StatusBadge } from '@/components/common/status-badge';
import { SENDABLE_CAMPAIGN_STATUSES } from '@/constants/notifications';
import { useAction } from '@/hooks/useAction';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { Campaign } from '@/types/notifications.types';
import { formatDateTime, formatNumber } from '@/utils/format';
import { CampaignFormModal } from './NotificationFormModals';

const canSend = (campaign: Campaign) => SENDABLE_CAMPAIGN_STATUSES.includes(campaign.status);

export const CampaignsTab = () => {
  const list = usePagedQuery(useGetCampaignsQuery);
  const [executeCampaign] = useExecuteCampaignMutation();
  const [setCampaignStatus] = useSetCampaignStatusMutation();
  const [deleteCampaign] = useDeleteCampaignMutation();
  const { run } = useAction();

  return (
    <CrudTable
      list={list}
      entity="campaign"
      rowKey={(campaign) => campaign.id}
      nameOf={(campaign) => campaign.title}
      columns={[
        { key: 'title', header: 'Title', render: (campaign) => campaign.title },
        { key: 'audience', header: 'Audience', render: (campaign) => campaign.targetAudience },
        { key: 'when', header: 'Planned / sent', render: (campaign) => formatDateTime(campaign.sentAt ?? campaign.scheduledAt) },
        { key: 'reach', header: 'Recipients', render: (campaign) => formatNumber(campaign.recipientCount) },
        { key: 'opened', header: 'Opened', render: (campaign) => formatNumber(campaign.openCount) },
        { key: 'status', header: 'Status', render: (campaign) => <StatusBadge status={campaign.status} /> },
      ]}
      rowActions={(campaign) =>
        canSend(campaign)
          ? [
              {
                label: 'Send now',
                onClick: () =>
                  run(
                    () => executeCampaign(campaign.id).unwrap(),
                    (result) => `Campaign sent to ${formatNumber(result.recipientCount)} customers`,
                  ),
              },
              {
                label: 'Cancel',
                onClick: () => run(() => setCampaignStatus({ id: campaign.id, status: 'Cancelled' }).unwrap(), 'Campaign cancelled'),
              },
            ]
          : []
      }
      renderForm={(props) => <CampaignFormModal {...props} />}
      onDelete={(campaign) => deleteCampaign(campaign.id).unwrap()}
    />
  );
};
