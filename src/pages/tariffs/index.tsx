import { useState, type ComponentType } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Tabs } from '@/components/ui/tabs';
import { TARIFF_TABS, type TariffTab } from '@/constants/tariffs';
import { LookupsTab } from './components/LookupsTab';
import { OverageTab } from './components/OverageTab';
import { PackagesTab } from './components/PackagesTab';
import { PlansTab } from './components/PlansTab';
import { TemplatesTab } from './components/TemplatesTab';

const TAB_CONTENT: Record<TariffTab, ComponentType> = {
  Packages: PackagesTab,
  Plans: PlansTab,
  Templates: TemplatesTab,
  'Distances & insurance': LookupsTab,
  'Overage charges': OverageTab,
};

const Tariffs = () => {
  const [tab, setTab] = useState<TariffTab>(TARIFF_TABS[0]);
  const Content = TAB_CONTENT[tab];

  return (
    <>
      <PageHeader title="Tariffs" />
      <Tabs tabs={TARIFF_TABS} active={tab} onChange={setTab} />
      <Content />
    </>
  );
};

export default Tariffs;
