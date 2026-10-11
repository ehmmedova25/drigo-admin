import { useState, type ComponentType } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Tabs } from '@/components/ui/tabs';
import { NOTIFICATION_TABS, type NotificationTab } from '@/constants/notifications';
import { AppTextsTab } from './components/AppTextsTab';
import { CampaignsTab } from './components/CampaignsTab';
import { HistoryTab } from './components/HistoryTab';
import { ScheduledTab } from './components/ScheduledTab';
import { SendTab } from './components/SendTab';

const TAB_CONTENT: Record<NotificationTab, ComponentType> = {
  Send: SendTab,
  Campaigns: CampaignsTab,
  Scheduled: ScheduledTab,
  History: HistoryTab,
  'App texts': AppTextsTab,
};

const Notifications = () => {
  const [tab, setTab] = useState<NotificationTab>(NOTIFICATION_TABS[0]);
  const Content = TAB_CONTENT[tab];

  return (
    <>
      <PageHeader title="Notifications" />
      <Tabs tabs={NOTIFICATION_TABS} active={tab} onChange={setTab} />
      <Content />
    </>
  );
};

export default Notifications;
