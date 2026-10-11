import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetMobileTextsQuery, useUpdateMobileTextMutation } from '@/api/endpoints/notificationsApi';
import { CrudTable } from '@/components/common/crud-table';
import { FormTextareaField } from '@/components/common/form-textarea-field';
import { FormModal } from '@/components/common/form-modal';
import { Span } from '@/components/ui/span';
import type { MobileText } from '@/types/notifications.types';
import { formatDateTime } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { mobileTextSchema, type MobileTextFormValues } from '../notifications.schema';
import styles from './AppTextsTab.module.scss';

export interface TextModalProps {
  text: MobileText;
  onClose: () => void;
}

const TextModal = ({ text, onClose }: TextModalProps) => {
  const [updateMobileText] = useUpdateMobileTextMutation();
  const form = useForm({ resolver: yupResolver(mobileTextSchema), defaultValues: { value: text.value } });
  const value = useWatch({ control: form.control, name: 'value' });

  const save = (values: MobileTextFormValues) => updateMobileText({ id: text.id, value: values.value }).unwrap();

  return (
    <FormModal
      title={`Edit "${text.key}"`}
      submitText="Save"
      successMessage="Text updated"
      form={form}
      canSubmit={value !== text.value}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextareaField name="value" control={form.control} label="Text shown in the app" />
    </FormModal>
  );
};

export const AppTextsTab = () => {
  const list = toListState(useGetMobileTextsQuery());
  const [editing, setEditing] = useState<MobileText | null>(null);

  return (
    <>
      <CrudTable
        list={list}
        entity="text"
        rowKey={(text) => text.id}
        nameOf={(text) => text.key}
        columns={[
          { key: 'key', header: 'Key', render: (text) => <Span className={styles.key} color="var(--text-primary)">{text.key}</Span> },
          { key: 'value', header: 'Text', render: (text) => text.value },
          { key: 'lang', header: 'Language', render: (text) => text.language.toUpperCase() },
          { key: 'updated', header: 'Updated', render: (text) => formatDateTime(text.updatedAt) },
        ]}
        rowActions={(text) => [{ label: 'Edit', onClick: () => setEditing(text) }]}
      />
      {editing && <TextModal text={editing} onClose={() => setEditing(null)} />}
    </>
  );
};
