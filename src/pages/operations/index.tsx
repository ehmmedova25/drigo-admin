import { useState, type ComponentType } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Tabs } from '@/components/ui/tabs';
import { OPERATIONS_TABS, type OperationsTab } from '@/constants/operations';
import { CleaningsTab } from './components/CleaningsTab';
import { EmployeesTab, ExitSurveysTab, InquiriesTab } from './components/PeopleTabs';
import { CarReportsTab, ProblemReportsTab } from './components/ReportsTabs';
import { ServicesTab } from './components/ServicesTab';

const TAB_CONTENT: Record<OperationsTab, ComponentType> = {
  Cleanings: CleaningsTab,
  'Car reports': CarReportsTab,
  'Problem reports': ProblemReportsTab,
  Services: ServicesTab,
  Employees: EmployeesTab,
  'Business inquiries': InquiriesTab,
  'Exit surveys': ExitSurveysTab,
};

const Operations = () => {
  const [tab, setTab] = useState<OperationsTab>(OPERATIONS_TABS[0]);
  const Content = TAB_CONTENT[tab];

  return (
    <>
      <PageHeader title="Field operations" />
      <Tabs tabs={OPERATIONS_TABS} active={tab} onChange={setTab} />
      <Content />
    </>
  );
};

export default Operations;
