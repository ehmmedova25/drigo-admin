import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAddCustomerDebtMutation, useSplitDebtMutation } from '@/api/endpoints/debtsApi';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import { Paragraph } from '@/components/ui/paragraph';
import { DEBT_TYPES, SPLIT_PARTS } from '@/constants/debts';
import type { Debt, NewDebt } from '@/types/debts.types';
import { formatMoney } from '@/utils/format';
import { addDebtSchema, splitDebtSchema, type AddDebtFormValues, type SplitDebtFormValues } from './debt-modals.schema';

export interface DebtModalProps {
  userId: string;
  onClose: () => void;
}

export interface SplitDebtModalProps extends DebtModalProps {
  debt: Debt;
}

const toPayload = (values: AddDebtFormValues): NewDebt => ({
  type: values.type,
  amount: values.amount,
  description: values.description || undefined,
});

export const AddDebtModal = ({ userId, onClose }: DebtModalProps) => {
  const [addDebt] = useAddCustomerDebtMutation();

  const form = useForm({
    resolver: yupResolver(addDebtSchema),
    defaultValues: { type: DEBT_TYPES[0], amount: undefined, description: '' },
  });

  return (
    <FormModal
      title="Add debt"
      submitText="Add"
      successMessage="Debt added"
      form={form}
      onSubmit={(values) => addDebt({ userId, debt: toPayload(values) }).unwrap()}
      onClose={onClose}
    >
      <FormSelectField name="type" control={form.control} label="Type" options={DEBT_TYPES} />
      <FormTextField name="amount" control={form.control} label="Amount" type="number" min={0} />
      <FormTextField name="description" control={form.control} label="Description" />
    </FormModal>
  );
};

export const SplitDebtModal = ({ userId, debt, onClose }: SplitDebtModalProps) => {
  const [splitDebt] = useSplitDebtMutation();

  const form = useForm({
    resolver: yupResolver(splitDebtSchema),
    defaultValues: { parts: SPLIT_PARTS.min },
  });
  const parts = Number(useWatch({ control: form.control, name: 'parts' }));
  const valid = parts >= SPLIT_PARTS.min && parts <= SPLIT_PARTS.max;

  return (
    <FormModal
      title={`Split debt #${debt.id}`}
      submitText="Split"
      successMessage={`Debt split into ${parts} parts`}
      form={form}
      onSubmit={(values: SplitDebtFormValues) => splitDebt({ userId, debtId: debt.id, parts: values.parts }).unwrap()}
      onClose={onClose}
    >
      <FormTextField
        name="parts"
        control={form.control}
        label={`Number of parts (${SPLIT_PARTS.min}–${SPLIT_PARTS.max})`}
        type="number"
        min={SPLIT_PARTS.min}
        max={SPLIT_PARTS.max}
      />
      {valid && <Paragraph color="var(--text-muted)">Each part: {formatMoney(debt.amount / parts, debt.currency)}</Paragraph>}
    </FormModal>
  );
};
