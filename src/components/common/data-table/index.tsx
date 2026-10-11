import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Pagination } from '@/components/ui/pagination';
import { Stack } from '@/components/ui/stack';
import { Table, type TableProps } from '@/components/ui/table';
import type { PagedList } from '@/hooks/usePagedQuery';

export type { Column } from '@/components/ui/table';

export interface DataTableProps<T> extends Omit<TableProps<T>, 'dimmed'> {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyText?: string;
}

export const DataTable = <T,>({ rows, loading = false, error = null, onRetry, emptyText, ...props }: DataTableProps<T>) => {
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (loading && rows.length === 0) return <Loader />;
  if (rows.length === 0) return <EmptyState text={emptyText} />;
  return <Table rows={rows} dimmed={loading} {...props} />;
};

export type PagedTableProps<T> = Omit<DataTableProps<T>, 'rows' | 'loading' | 'error' | 'onRetry'> & { list: PagedList<T> };

export const PagedTable = <T,>({ list, ...props }: PagedTableProps<T>) => {
  return (
    <Stack gap="sm">
      <DataTable {...props} rows={list.rows} loading={list.loading} error={list.error} onRetry={list.reload} />
      <Pagination page={list.page} pageSize={list.pageSize} total={list.total} onChange={list.setPage} />
    </Stack>
  );
};
