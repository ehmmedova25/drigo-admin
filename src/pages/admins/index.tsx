import { useState } from 'react';
import { useGetAdminsQuery, useSetAdminSuperAdminMutation } from '@/api/endpoints/adminsApi';
import { CrudTable } from '@/components/common/crud-table';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Code } from '@/components/ui/code';
import { useAction } from '@/hooks/useAction';
import { useAuth } from '@/hooks/useAuth';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { Admin } from '@/types/auth.types';
import { AddAdminModal } from './components/AddAdminModal';
import { PermissionsModal } from './components/PermissionsModal';

const Admins = () => {
  const { admin: me } = useAuth();
  const list = usePagedQuery(useGetAdminsQuery);
  const [setAdminSuperAdmin] = useSetAdminSuperAdminMutation();
  const { run } = useAction();
  const [editing, setEditing] = useState<Admin | null>(null);

  return (
    <>
      <PageHeader title="Admins & permissions" />
      <CrudTable
        list={list}
        entity="admin"
        rowKey={(admin) => admin.id}
        nameOf={(admin) => admin.username}
        columns={[
          { key: 'name', header: 'Name', render: (admin) => (admin.id === me?.id ? `${admin.fullName} (you)` : admin.fullName) },
          { key: 'username', header: 'Username', render: (admin) => <Code>{admin.username}</Code> },
          { key: 'email', header: 'Email', render: (admin) => admin.email },
          { key: 'role', header: 'Role', render: (admin) => <StatusBadge status={admin.isSuperAdmin ? 'Super admin' : 'Admin'} /> },
        ]}
        rowActions={(admin) => [
          { label: 'Permissions', onClick: () => setEditing(admin) },
          ...(admin.id === me?.id
            ? []
            : [
                {
                  label: admin.isSuperAdmin ? 'Remove super admin' : 'Make super admin',
                  onClick: () =>
                    run(
                      () => setAdminSuperAdmin({ adminId: admin.id, isSuperAdmin: !admin.isSuperAdmin }).unwrap(),
                      `${admin.username} updated`,
                    ),
                },
              ]),
        ]}
        renderForm={(props) => <AddAdminModal {...props} />}
        editable={false}
      />
      {editing && <PermissionsModal admin={editing} onClose={() => setEditing(null)} />}
    </>
  );
};

export default Admins;
