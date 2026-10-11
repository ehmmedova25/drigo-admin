import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetCustomerQuery, useRestoreCustomerMutation, useSetCustomerBlockedMutation } from '@/api/endpoints/customersApi';
import { DebtPanel } from '@/components/common/debt-panel';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { CUSTOMER_TABS, type CustomerTab } from '@/constants/customers';
import { ROUTES } from '@/constants/paths';
import { useAction } from '@/hooks/useAction';
import { getErrorMessage } from '@/utils/apiError';
import { customerState } from '@/utils/customerState';
import { formatDateTime } from '@/utils/format';
import { ApproveModal, BlockModal, DeleteCustomerModal, RejectModal } from './components/CustomerActionModals';
import { BonusTab, DevicesTab, LoginHistoryTab, PaymentsTab, RentalsTab, ReservationsTab } from './components/ListTabs';
import { OverviewTab } from './components/OverviewTab';

type ModalKind = 'approve' | 'reject' | 'block' | 'delete';

const CustomerDetail = () => {
  const { id = '' } = useParams();
  const { data: customer, isLoading, error, refetch } = useGetCustomerQuery(id);
  const [restoreCustomer] = useRestoreCustomerMutation();
  const [setBlocked] = useSetCustomerBlockedMutation();
  const { run, busy } = useAction();
  const [tab, setTab] = useState<CustomerTab>(CUSTOMER_TABS[0]);
  const [modal, setModal] = useState<ModalKind | null>(null);

  if (isLoading) return <Loader />;
  if (error || !customer) return <ErrorState error={getErrorMessage(error)} onRetry={refetch} />;
  const modalProps = { customerId: customer.id, onClose: () => setModal(null) };

  const actions = customer.isDeleted ? (
    <Button variant="primary" disabled={busy} onClick={() => run(() => restoreCustomer(customer.id).unwrap(), 'Customer restored')}>
      Restore
    </Button>
  ) : (
    <>
      <Button variant="primary" disabled={customer.isApproved} onClick={() => setModal('approve')}>
        Approve
      </Button>
      <Button onClick={() => setModal('reject')}>Reject docs</Button>
      {customer.isBlocked ? (
        <Button disabled={busy} onClick={() => run(() => setBlocked({ id: customer.id, blocked: false }).unwrap(), 'Customer unblocked')}>
          Unblock
        </Button>
      ) : (
        <Button onClick={() => setModal('block')}>Block</Button>
      )}
      <Button variant="danger" onClick={() => setModal('delete')}>
        Delete
      </Button>
    </>
  );

  return (
    <>
      <PageHeader
        back={{ to: ROUTES.CUSTOMERS, label: 'Customers' }}
        title={customer.fullName}
        badge={<StatusBadge status={customerState(customer)} />}
        actions={actions}
      />
      {customer.isDeleted && <Alert variant="error">Deleted on {formatDateTime(customer.deletedAt)}.</Alert>}

      <Tabs tabs={CUSTOMER_TABS} active={tab} onChange={setTab} />
      {tab === 'Overview' && <OverviewTab customer={customer} />}
      {tab === 'Rentals' && <RentalsTab customerId={customer.id} />}
      {tab === 'Payments' && <PaymentsTab customerId={customer.id} />}
      {tab === 'Debt' && (
        <Card>
          <DebtPanel userId={customer.id} />
        </Card>
      )}
      {tab === 'Bonus' && <BonusTab customerId={customer.id} />}
      {tab === 'Reservations' && <ReservationsTab customerId={customer.id} />}
      {tab === 'Devices' && <DevicesTab customerId={customer.id} />}
      {tab === 'Login history' && <LoginHistoryTab customerId={customer.id} />}

      {modal === 'approve' && <ApproveModal {...modalProps} />}
      {modal === 'reject' && <RejectModal {...modalProps} />}
      {modal === 'block' && <BlockModal {...modalProps} />}
      {modal === 'delete' && <DeleteCustomerModal {...modalProps} />}
    </>
  );
};

export default CustomerDetail;
