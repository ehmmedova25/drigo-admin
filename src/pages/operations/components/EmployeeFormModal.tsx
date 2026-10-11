import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateEmployeeMutation } from '@/api/endpoints/operationsApi';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import { EMPLOYEE_ROLES } from '@/constants/operations';
import type { CrudFormProps } from '@/hooks/useCrudModals';
import type { Employee } from '@/types/operations.types';
import { employeeSchema, type EmployeeFormValues } from '../operations.schema';

export const EmployeeFormModal = ({ onClose }: CrudFormProps<Employee>) => {
  const [createEmployee] = useCreateEmployeeMutation();

  const form = useForm({
    resolver: yupResolver(employeeSchema),
    defaultValues: { fullName: '', role: EMPLOYEE_ROLES[0], phoneNumber: '' },
  });

  const save = (values: EmployeeFormValues) => createEmployee(values).unwrap();

  return (
    <FormModal title="New employee" submitText="Save" successMessage="Employee added" form={form} onSubmit={save} onClose={onClose}>
      <FormTextField name="fullName" control={form.control} label="Full name" />
      <FormSelectField name="role" control={form.control} label="Role" options={EMPLOYEE_ROLES} />
      <FormTextField name="phoneNumber" control={form.control} label="Phone" />
    </FormModal>
  );
};
