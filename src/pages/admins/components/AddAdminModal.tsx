import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateAdminMutation } from '@/api/endpoints/adminsApi';
import { FormField } from '@/components/common/form-field';
import { FormCheckboxField } from '@/components/common/form-checkbox-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import { Input } from '@/components/ui/input';
import { MIN_PASSWORD_LENGTH } from '@/constants/admins';
import type { CrudFormProps } from '@/hooks/useCrudModals';
import type { Admin } from '@/types/auth.types';
import { addAdminSchema, type AddAdminFormValues } from '../admins.schema';

export const AddAdminModal = ({ onClose }: CrudFormProps<Admin>) => {
  const [createAdmin] = useCreateAdminMutation();
  const form = useForm({
    resolver: yupResolver(addAdminSchema),
    defaultValues: { username: '', password: '', fullName: '', email: '', isSuperAdmin: false },
  });
  const username = useWatch({ control: form.control, name: 'username' });

  return (
    <FormModal
      title="New admin"
      submitText="Create"
      successMessage={`Admin ${username} created`}
      form={form}
      onSubmit={(values: AddAdminFormValues) => createAdmin(values).unwrap()}
      onClose={onClose}
    >
      <Controller
        name="username"
        control={form.control}
        render={({ field, fieldState }) => (
          <FormField label="Username" error={fieldState.error?.message}>
            <Input
              fullWidth
              name={field.name}
              ref={field.ref}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={Boolean(fieldState.error)}
              autoComplete="off"
            />
          </FormField>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <FormField label={`Password (min ${MIN_PASSWORD_LENGTH} characters)`} error={fieldState.error?.message}>
            <Input
              fullWidth
              type="password"
              name={field.name}
              ref={field.ref}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={Boolean(fieldState.error)}
              autoComplete="new-password"
            />
          </FormField>
        )}
      />
      <FormTextField name="fullName" control={form.control} label="Full name" />
      <FormTextField name="email" control={form.control} label="Email" type="email" />
      <FormCheckboxField name="isSuperAdmin" control={form.control} label="Super admin (sees and does everything)" />
    </FormModal>
  );
};
