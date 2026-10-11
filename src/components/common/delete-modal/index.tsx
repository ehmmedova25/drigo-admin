import { ActionModal } from '@/components/common/action-modal';
import { Paragraph } from '@/components/ui/paragraph';

export interface DeleteModalProps {
  entity: string;
  name: string;
  onDelete: () => Promise<unknown>;
  onClose: () => void;
}

export const DeleteModal = ({ entity, name, onDelete, onClose }: DeleteModalProps) => {
  return (
    <ActionModal
      title={`Delete ${entity}`}
      submitText="Delete"
      successMessage={`${entity[0].toUpperCase()}${entity.slice(1)} deleted`}
      danger
      onSubmit={onDelete}
      onClose={onClose}
    >
      <Paragraph>Delete "{name}"? This cannot be undone.</Paragraph>
    </ActionModal>
  );
};
