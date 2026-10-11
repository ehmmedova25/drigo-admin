import { useState, type ComponentType } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Tabs } from '@/components/ui/tabs';
import { PROMOTION_TABS, type PromotionTab } from '@/constants/promotions';
import { DiscountsTab } from './components/DiscountsTab';
import { PromoCodesTab } from './components/PromoCodesTab';
import { PromotionsTab } from './components/PromotionsTab';
import { ReferralsTab } from './components/ReferralsTab';
import { StoriesTab } from './components/StoriesTab';

const TAB_CONTENT: Record<PromotionTab, ComponentType> = {
  Promotions: PromotionsTab,
  Discounts: DiscountsTab,
  'Promo codes': PromoCodesTab,
  Stories: StoriesTab,
  Referrals: ReferralsTab,
};

const Promotions = () => {
  const [tab, setTab] = useState<PromotionTab>(PROMOTION_TABS[0]);
  const Content = TAB_CONTENT[tab];

  return (
    <>
      <PageHeader title="Promotions" />
      <Tabs tabs={PROMOTION_TABS} active={tab} onChange={setTab} />
      <Content />
    </>
  );
};

export default Promotions;
