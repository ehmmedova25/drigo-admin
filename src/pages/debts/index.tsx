import { useState } from 'react';
import { DEBT_REPORT_URL } from '@/api/endpoints/debtsApi';
import { PageHeader } from '@/components/common/page-header';
import { Link } from '@/components/ui/link';
import { Tabs } from '@/components/ui/tabs';
import { DEBT_TABS, type DebtTab } from '@/constants/debts';
import { AllDebtsTab } from './components/AllDebtsTab';
import { DebtorsTab } from './components/DebtorsTab';

const Debts = () => {
  const [tab, setTab] = useState<DebtTab>(DEBT_TABS[0]);

  return (
    <>
      <PageHeader
        title="Debts"
        actions={
          <Link href={DEBT_REPORT_URL} target="_blank" rel="noreferrer">
            Download CSV
          </Link>
        }
      />
      <Tabs tabs={DEBT_TABS} active={tab} onChange={setTab} />
      {tab === 'Debtors' ? <DebtorsTab /> : <AllDebtsTab />}
    </>
  );
};

export default Debts;
