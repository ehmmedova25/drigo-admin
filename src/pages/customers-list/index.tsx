import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCustomersQuery } from '@/api/endpoints/customersApi';
import { PagedTable, type Column } from '@/components/common/data-table';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Stack } from '@/components/ui/stack';
import { APPROVAL_FILTERS } from '@/constants/customers';
import { ROUTES } from '@/constants/paths';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { CustomerListItem } from '@/types/customers.types';
import { customerState } from '@/utils/customerState';
import { formatDate, orDash } from '@/utils/format';

const columns: Column<CustomerListItem>[] = [
  { key: 'name', header: 'Name', render: (customer) => customer.fullName },
  { key: 'phone', header: 'Phone', render: (customer) => customer.phoneNumber },
  { key: 'email', header: 'Email', render: (customer) => orDash(customer.email) },
  { key: 'type', header: 'Type', render: (customer) => customer.userType },
  { key: 'platform', header: 'Platform', render: (customer) => customer.platform },
  { key: 'state', header: 'Status', render: (customer) => <StatusBadge status={customerState(customer)} /> },
  { key: 'created', header: 'Registered', render: (customer) => formatDate(customer.createdAt) },
];

const CustomersList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const list = usePagedQuery(useGetCustomersQuery, { search: useDebounce(search), approvalStatus });

  return (
    <>
      <PageHeader title="Customers" />
      <Card>
        <Stack direction="row" gap="xs" align="center" wrap>
          <Input placeholder="Search name, phone, email" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select value={approvalStatus} onChange={setApprovalStatus} options={APPROVAL_FILTERS} placeholder="All" />
        </Stack>
        <PagedTable
          list={list}
          columns={columns}
          rowKey={(customer) => customer.id}
          onRowClick={(customer) => navigate(ROUTES.CUSTOMER(customer.id))}
          emptyText="No customers found"
        />
      </Card>
    </>
  );
};

export default CustomersList;
