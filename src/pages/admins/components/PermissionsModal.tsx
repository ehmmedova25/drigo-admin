import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetAdminPermissionsQuery, useSaveAdminPermissionsMutation } from '@/api/endpoints/adminsApi';
import { ErrorState } from '@/components/common/error-state';
import { FormModal } from '@/components/common/form-modal';
import { Loader } from '@/components/common/loader';
import { Alert } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Modal } from '@/components/ui/modal';
import { Table, type Column } from '@/components/ui/table';
import { PERMISSION_ACTIONS } from '@/constants/admins';
import type { AdminPermissions, ModulePermissions } from '@/types/admins.types';
import type { Admin } from '@/types/auth.types';
import { getErrorMessage } from '@/utils/apiError';
import { permissionsSchema, type PermissionsFormValues } from '../admins.schema';

export interface PermissionsModalProps {
  admin: Admin;
  onClose: () => void;
}

const toggleCode = (codes: string[], code: string) =>
  codes.includes(code) ? codes.filter((current) => current !== code) : [...codes, code];

const PermissionsForm = ({ admin, data, onClose }: PermissionsModalProps & { data: AdminPermissions }) => {
  const [saveAdminPermissions] = useSaveAdminPermissionsMutation();
  const form = useForm({
    resolver: yupResolver(permissionsSchema),
    defaultValues: { permissionCodes: data.permissionCodes },
  });

  const columns: Column<ModulePermissions>[] = [
    { key: 'module', header: 'Module', render: (module) => module.moduleName },
    ...PERMISSION_ACTIONS.map(
      (action): Column<ModulePermissions> => ({
        key: action,
        header: action,
        render: (module) => {
          const code = `${module.moduleCode}.${action}`;
          const exists = module.permissions.some((permission) => permission.code === code);
          return (
            exists && (
              <Controller
                name="permissionCodes"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    ariaLabel={code}
                    checked={field.value.includes(code)}
                    onChange={() => field.onChange(toggleCode(field.value, code))}
                  />
                )}
              />
            )
          );
        },
      }),
    ),
  ];

  const save = (values: PermissionsFormValues) =>
    saveAdminPermissions({ adminId: admin.id, permissionCodes: values.permissionCodes }).unwrap();

  return (
    <FormModal
      title={`Permissions: ${admin.fullName}`}
      wide
      submitText="Save permissions"
      successMessage="Permissions saved"
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      {data.isSuperAdmin && (
        <Alert variant="info">This admin is a super admin and has every permission regardless of the boxes below.</Alert>
      )}
      <Table columns={columns} rows={data.modulePermissions} rowKey={(module) => module.moduleId} />
    </FormModal>
  );
};

export const PermissionsModal = ({ admin, onClose }: PermissionsModalProps) => {
  const { data, error, refetch } = useGetAdminPermissionsQuery(admin.id);

  if (data) return <PermissionsForm admin={admin} data={data} onClose={onClose} />;

  return (
    <Modal title={`Permissions: ${admin.fullName}`} onClose={onClose}>
      {error ? <ErrorState error={getErrorMessage(error)} onRetry={refetch} /> : <Loader />}
    </Modal>
  );
};
