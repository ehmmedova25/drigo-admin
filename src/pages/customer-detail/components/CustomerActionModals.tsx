import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useApproveCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomerRejectionReasonsQuery,
  useRejectCustomerMutation,
  useSetCustomerBlockedMutation,
} from '@/api/endpoints/customersApi';
import { ActionModal } from '@/components/common/action-modal';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import { Paragraph } from '@/components/ui/paragraph';
import { blockSchema, rejectSchema, type BlockFormValues, type RejectFormValues } from '../customer-detail.schema';

export interface CustomerActionModalProps {
  customerId: string;
  onClose: () => void;
}

export const ApproveModal = ({ customerId, onClose }: CustomerActionModalProps) => {
  const [approveCustomer] = useApproveCustomerMutation();

  return (
    <ActionModal
      title="Approve customer"
      submitText="Approve"
      successMessage="Customer approved"
      onSubmit={() => approveCustomer(customerId).unwrap()}
      onClose={onClose}
    >
      <Paragraph>All documents and the face check will be marked Verified and the customer can rent cars.</Paragraph>
    </ActionModal>
  );
};

export const RejectModal = ({ customerId, onClose }: CustomerActionModalProps) => {
  const { data: reasons } = useGetCustomerRejectionReasonsQuery();
  const [rejectCustomer] = useRejectCustomerMutation();

  const form = useForm({
    resolver: yupResolver(rejectSchema),
    defaultValues: { reason: '' },
  });

  return (
    <FormModal
      title="Reject documents"
      submitText="Reject"
      successMessage="Documents rejected"
      danger
      form={form}
      onSubmit={(values: RejectFormValues) => rejectCustomer({ id: customerId, rejectionReason: values.reason }).unwrap()}
      onClose={onClose}
    >
      <FormSelectField
        name="reason"
        control={form.control}
        label="Reason"
        placeholder="Select a reason"
        options={(reasons ?? []).map((item) => ({ value: item.reason, label: `${item.documentType}: ${item.reason}` }))}
      />
    </FormModal>
  );
};

export const BlockModal = ({ customerId, onClose }: CustomerActionModalProps) => {
  const [setBlocked] = useSetCustomerBlockedMutation();

  const form = useForm({
    resolver: yupResolver(blockSchema),
    defaultValues: { reason: '' },
  });

  return (
    <FormModal
      title="Block customer"
      submitText="Block"
      successMessage="Customer blocked"
      danger
      form={form}
      onSubmit={(values: BlockFormValues) => setBlocked({ id: customerId, blocked: true, reason: values.reason || undefined }).unwrap()}
      onClose={onClose}
    >
      <FormTextField name="reason" control={form.control} label="Reason" placeholder="e.g. Unpaid debts" />
    </FormModal>
  );
};

export const DeleteCustomerModal = ({ customerId, onClose }: CustomerActionModalProps) => {
  const [deleteCustomer] = useDeleteCustomerMutation();

  return (
    <ActionModal
      title="Delete customer"
      submitText="Delete"
      successMessage="Customer deleted"
      danger
      onSubmit={() => deleteCustomer(customerId).unwrap()}
      onClose={onClose}
    >
      <Paragraph>The customer will be soft-deleted. You can restore them later from this page.</Paragraph>
    </ActionModal>
  );
};
