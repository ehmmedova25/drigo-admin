import { useState } from 'react';

export const useCrudModals = <T>() => {
  const [editing, setEditing] = useState<T | 'new' | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);

  return {
    isFormOpen: editing !== null,
    formItem: editing === 'new' ? null : editing,
    deleting,
    create: () => setEditing('new'),
    edit: (item: T) => setEditing(item),
    remove: (item: T) => setDeleting(item),
    close: () => {
      setEditing(null);
      setDeleting(null);
    },
  };
};

export interface CrudFormProps<T> {
  item: T | null;
  onClose: () => void;
}
