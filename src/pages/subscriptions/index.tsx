import { useState } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Tabs } from '@/components/ui/tabs';
import { SUBSCRIPTION_TABS, type SubscriptionTab } from '@/constants/subscriptions';
import { BookingsTab } from './components/BookingsTab';
import { PlansTab } from './components/PlansTab';

const Subscriptions = () => {
  const [tab, setTab] = useState<SubscriptionTab>(SUBSCRIPTION_TABS[0]);

  return (
    <>
      <PageHeader title="Subscriptions" />
      <Tabs tabs={SUBSCRIPTION_TABS} active={tab} onChange={setTab} />
      {tab === 'Plans by model' ? <PlansTab /> : <BookingsTab />}
    </>
  );
};

export default Subscriptions;
