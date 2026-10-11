import { useState, type ComponentType } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Tabs } from '@/components/ui/tabs';
import { FINE_TABS, type FineTab } from '@/constants/fines';
import { AllFinesTab, ByCarTab, ReviewTab, ScraperTab } from './components/FineTabs';

const TAB_CONTENT: Record<FineTab, ComponentType> = {
  'All fines': AllFinesTab,
  'Review queue': ReviewTab,
  'From scraper': ScraperTab,
  'By car': ByCarTab,
};

const Fines = () => {
  const [tab, setTab] = useState<FineTab>(FINE_TABS[0]);
  const Content = TAB_CONTENT[tab];

  return (
    <>
      <PageHeader title="Fines" />
      <Tabs tabs={FINE_TABS} active={tab} onChange={setTab} />
      <Content />
    </>
  );
};

export default Fines;
