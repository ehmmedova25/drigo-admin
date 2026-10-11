import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink } from 'react-router-dom';
import {
  useBillFineToCustomerMutation,
  useCreateFineMutation,
  useDecideFineMutation,
  useGetFineRentalOptionsQuery,
} from '@/api/endpoints/finesApi';
import { ActionModal } from '@/components/common/action-modal';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import { Loader } from '@/components/common/loader';
import { Link } from '@/components/ui/link';
import { Paragraph } from '@/components/ui/paragraph';
import { Span } from '@/components/ui/span';
import { FINE_TYPES } from '@/constants/fines';
import { ROUTES } from '@/constants/paths';
import type { Fine, FineDecision, NewFine } from '@/types/fines.types';
import { formatDateTime, formatMoney } from '@/utils/format';
import { billCustomerSchema, newFineSchema, type BillCustomerFormValues, type NewFineFormValues } from '../fines.schema';

export interface FineModalProps {
  onClose: () => void;
}

export interface BillCustomerModalProps extends FineModalProps {
  fine: Fine;
}

export interface FineDecisionModalProps extends FineModalProps {
  fine: Fine;
  decision: FineDecision;
}

const Strong = ({ children }: { children: string }) => (
  <Span color="var(--text-primary)" weight="500">
    {children}
  </Span>
);

export const BillCustomerModal = ({ fine, onClose }: BillCustomerModalProps) => {
  const { data: options, isLoading } = useGetFineRentalOptionsQuery(fine.id, { skip: Boolean(fine.userId) });
  const [billFineToCustomer] = useBillFineToCustomerMutation();

  const form = useForm({
    resolver: yupResolver(billCustomerSchema),
    context: { needsRental: !fine.userId },
    defaultValues: { rentalId: undefined },
  });

  const bill = (values: BillCustomerFormValues) => billFineToCustomer({ fine, rentalId: values.rentalId }).unwrap();

  return (
    <FormModal
      title={`Bill fine ${fine.referenceNumber} to customer`}
      submitText="Bill customer"
      successMessage="Fine billed. A debt was added to the customer."
      form={form}
      onSubmit={bill}
      onClose={onClose}
    >
      <Paragraph>
        Amount <Strong>{formatMoney(fine.amount, fine.currency)}</Strong>. The fine becomes <Strong>Billed</Strong> and a new{' '}
        <Strong>Fine</Strong> debt is created on the customer.
      </Paragraph>
      {fine.userId ? (
        <Paragraph color="var(--text-muted)">
          Linked to rental #{fine.rentalId}.{' '}
          <Link component={RouterLink} to={ROUTES.CUSTOMER(fine.userId)}>
            Open customer
          </Link>
        </Paragraph>
      ) : isLoading ? (
        <Loader />
      ) : (
        <FormSelectField
          name="rentalId"
          control={form.control}
          label="Who was driving? Pick the rental of this car"
          placeholder="Select rental"
          options={(options ?? []).map((o) => ({
            value: o.rentalId,
            label: `#${o.rentalId} · ${o.userName} · ${formatDateTime(o.startDate)} – ${formatDateTime(o.endDate)}`,
          }))}
        />
      )}
    </FormModal>
  );
};

const DECISION_TEXT: Record<FineDecision, { title: string; message: (fine: Fine) => string; success: string }> = {
  'bill-company': {
    title: 'Bill company',
    message: (f) => `DRIGO pays ${formatMoney(f.amount, f.currency)}. No customer debt is created.`,
    success: 'Fine billed to company',
  },
  dismiss: { title: 'Dismiss fine', message: () => 'The fine will be marked Dismissed.', success: 'Fine dismissed' },
  unbill: {
    title: 'Unbill fine',
    message: () => 'The fine goes back to Pending. A debt already created for the customer is not removed automatically.',
    success: 'Fine set back to Pending',
  },
};

export const FineDecisionModal = ({ fine, decision, onClose }: FineDecisionModalProps) => {
  const [decideFine] = useDecideFineMutation();
  const text = DECISION_TEXT[decision];

  return (
    <ActionModal
      title={text.title}
      submitText={text.title}
      successMessage={text.success}
      danger={decision === 'dismiss'}
      onSubmit={() => decideFine({ fineId: fine.id, decision }).unwrap()}
      onClose={onClose}
    >
      <Paragraph>{text.message(fine)}</Paragraph>
    </ActionModal>
  );
};

const toPayload = (values: NewFineFormValues): NewFine => ({
  ...values,
  location: values.location || undefined,
});

export const NewFineModal = ({ onClose }: FineModalProps) => {
  const [createFine] = useCreateFineMutation();

  const form = useForm({
    resolver: yupResolver(newFineSchema),
    defaultValues: { carId: undefined, type: FINE_TYPES[0], amount: undefined, location: '' },
  });

  return (
    <FormModal
      title="New fine"
      submitText="Create"
      successMessage="Fine created"
      form={form}
      onSubmit={(values) => createFine(toPayload(values)).unwrap()}
      onClose={onClose}
    >
      <FormTextField name="carId" control={form.control} label="Car ID" type="number" min={1} />
      <FormSelectField name="type" control={form.control} label="Type" options={FINE_TYPES} />
      <FormTextField name="amount" control={form.control} label="Amount" type="number" min={0} />
      <FormTextField name="location" control={form.control} label="Location" />
    </FormModal>
  );
};
