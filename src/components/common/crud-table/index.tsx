import type { ReactNode } from 'react';
import { DataTable, type Column } from '@/components/common/data-table';
import { DeleteModal } from '@/components/common/delete-modal';
import { RowActions, type RowAction } from '@/components/common/row-actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Stack } from '@/components/ui/stack';
import { useCrudModals, type CrudFormProps } from '@/hooks/useCrudModals';
import type { PagedList } from '@/hooks/usePagedQuery';
import type { ListState } from '@/utils/queryState';

export interface CrudTableProps<T> {
  list: ListState<T> | PagedList<T>;
  columns: Column<T>[];
  rowKey: (item: T) => string | number;
  entity: string;
  nameOf: (item: T) => string;
  renderForm?: (props: CrudFormProps<T>) => ReactNode;
  editable?: boolean;
  onDelete?: (item: T) => Promise<unknown>;
  canDelete?: (item: T) => boolean;
  rowActions?: (item: T) => RowAction[];
  toolbar?: ReactNode;
  onRowClick?: (item: T) => void;
  emptyText?: string;
}

const isPaged = <T,>(list: ListState<T> | PagedList<T>): list is PagedList<T> => 'setPage' in list;

export const CrudTable = <T,>({
  list,
  columns,
  rowKey,
  entity,
  nameOf,
  renderForm,
  onDelete,
  rowActions,
  toolbar,
  onRowClick,
  emptyText,
  canDelete,
  editable = true,
}: CrudTableProps<T>) => {
  const crud = useCrudModals<T>();
  const { deleting } = crud;

  const actionsOf = (item: T): RowAction[] => [
    ...(rowActions?.(item) ?? []),
    ...(renderForm && editable ? [{ label: 'Edit', onClick: () => crud.edit(item) }] : []),
    ...(onDelete && (canDelete?.(item) ?? true) ? [{ label: 'Delete', onClick: () => crud.remove(item), danger: true }] : []),
  ];
  const hasActions = Boolean((renderForm && editable) || onDelete || rowActions);
  const allColumns: Column<T>[] = hasActions
    ? [...columns, { key: 'actions', header: '', render: (item) => <RowActions actions={actionsOf(item)} /> }]
    : columns;

  return (
    <Card>
      {(toolbar || renderForm) && (
        <Stack direction="row" align="center" justify="between" gap="xs" wrap>
          <Stack direction="row" align="center" gap="xs" wrap>
            {toolbar}
          </Stack>
          {renderForm && (
            <Button variant="primary" onClick={crud.create}>
              New {entity}
            </Button>
          )}
        </Stack>
      )}
      <DataTable
        columns={allColumns}
        rows={list.rows}
        rowKey={rowKey}
        loading={list.loading}
        error={list.error}
        onRetry={list.reload}
        onRowClick={onRowClick}
        emptyText={emptyText ?? `No ${entity}s`}
      />
      {isPaged(list) && <Pagination page={list.page} pageSize={list.pageSize} total={list.total} onChange={list.setPage} />}
      {crud.isFormOpen && renderForm?.({ item: crud.formItem, onClose: crud.close })}
      {deleting && onDelete && (
        <DeleteModal entity={entity} name={nameOf(deleting)} onDelete={() => onDelete(deleting)} onClose={crud.close} />
      )}
    </Card>
  );
};
