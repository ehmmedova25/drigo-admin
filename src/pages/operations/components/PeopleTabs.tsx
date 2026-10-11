import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  useGetBusinessInquiriesQuery,
  useGetEmployeesQuery,
  useGetExitSurveysQuery,
  useSetBusinessInquiryStatusMutation,
  useToggleEmployeeActiveMutation,
} from '@/api/endpoints/operationsApi';
import { CrudTable } from '@/components/common/crud-table';
import { StatusBadge } from '@/components/common/status-badge';
import { StatusChangeModal } from '@/components/common/status-change-modal';
import { Link } from '@/components/ui/link';
import { Span } from '@/components/ui/span';
import { INQUIRY_STATUSES, MAX_RATING } from '@/constants/operations';
import { ROUTES } from '@/constants/paths';
import { useAction } from '@/hooks/useAction';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { BusinessInquiry } from '@/types/operations.types';
import { formatDate, orDash } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { activeStatus, toggleActiveLabel } from '@/utils/status';
import { EmployeeFormModal } from './EmployeeFormModal';
import styles from './PeopleTabs.module.scss';

export const EmployeesTab = () => {
  const list = toListState(useGetEmployeesQuery());
  const [toggleEmployeeActive] = useToggleEmployeeActiveMutation();
  const { run } = useAction();

  return (
    <CrudTable
      list={list}
      entity="employee"
      rowKey={(employee) => employee.id}
      nameOf={(employee) => employee.fullName}
      columns={[
        { key: 'name', header: 'Name', render: (employee) => employee.fullName },
        { key: 'role', header: 'Role', render: (employee) => employee.role },
        { key: 'phone', header: 'Phone', render: (employee) => orDash(employee.phoneNumber) },
        { key: 'since', header: 'Since', render: (employee) => formatDate(employee.createdAt) },
        { key: 'status', header: 'Status', render: (employee) => <StatusBadge status={activeStatus(employee.isActive)} /> },
      ]}
      rowActions={(employee) => [
        {
          label: toggleActiveLabel(employee.isActive),
          onClick: () =>
            run(
              () => toggleEmployeeActive(employee.id).unwrap(),
              `${employee.fullName} ${employee.isActive ? 'deactivated' : 'activated'}`,
            ),
        },
      ]}
      renderForm={(props) => <EmployeeFormModal {...props} />}
      editable={false}
    />
  );
};

export const InquiriesTab = () => {
  const list = usePagedQuery(useGetBusinessInquiriesQuery);
  const [setBusinessInquiryStatus] = useSetBusinessInquiryStatusMutation();
  const [editing, setEditing] = useState<BusinessInquiry | null>(null);

  return (
    <>
      <CrudTable
        list={list}
        entity="inquiry"
        emptyText="No business inquiries"
        rowKey={(inquiry) => inquiry.id}
        nameOf={(inquiry) => inquiry.companyName}
        columns={[
          { key: 'date', header: 'Date', render: (inquiry) => formatDate(inquiry.createdAt) },
          {
            key: 'company',
            header: 'Company',
            render: (inquiry) => (
              <Span weight="500" color="var(--text-primary)">
                {inquiry.companyName}
              </Span>
            ),
          },
          { key: 'contact', header: 'Contact', render: (inquiry) => `${inquiry.contactName} · ${inquiry.phone}` },
          {
            key: 'email',
            header: 'Email',
            render: (inquiry) => <Link href={`mailto:${inquiry.email}`}>{inquiry.email}</Link>,
          },
          { key: 'fleet', header: 'Cars needed', render: (inquiry) => inquiry.fleetSize },
          {
            key: 'message',
            header: 'Message',
            render: (inquiry) => <span className={styles.ellipsis}>{inquiry.message}</span>,
          },
          { key: 'status', header: 'Status', render: (inquiry) => <StatusBadge status={inquiry.status} /> },
        ]}
        rowActions={(inquiry) => [{ label: 'Status', onClick: () => setEditing(inquiry) }]}
      />
      {editing && (
        <StatusChangeModal
          title={editing.companyName}
          current={editing.status}
          options={INQUIRY_STATUSES}
          onSubmit={(status) => setBusinessInquiryStatus({ id: editing.id, status }).unwrap()}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
};

export const ExitSurveysTab = () => {
  const list = usePagedQuery(useGetExitSurveysQuery);

  return (
    <CrudTable
      list={list}
      entity="survey"
      rowKey={(survey) => survey.id}
      nameOf={(survey) => `#${survey.id}`}
      columns={[
        { key: 'date', header: 'Date', render: (survey) => formatDate(survey.createdAt) },
        {
          key: 'customer',
          header: 'Customer',
          render: (survey) => (
            <Link component={RouterLink} to={ROUTES.CUSTOMER(survey.userId)}>
              Open profile
            </Link>
          ),
        },
        { key: 'rating', header: 'Rating', render: (survey) => `${survey.rating} / ${MAX_RATING}` },
        { key: 'reason', header: 'Reason', render: (survey) => survey.reason },
        { key: 'comment', header: 'Comment', render: (survey) => orDash(survey.comment) },
      ]}
    />
  );
};
