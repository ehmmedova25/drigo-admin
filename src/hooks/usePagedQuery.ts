import { useState } from 'react';
import { PAGE_SIZE } from '@/constants/config';
import type { Paged, Query } from '@/api/types';
import { getOptionalErrorMessage } from '@/utils/apiError';

interface PagedQueryResult<T> {
  data?: Paged<T>;
  isFetching: boolean;
  error?: unknown;
  refetch: () => unknown;
}

type PagedQueryHook<T> = (params: Query) => PagedQueryResult<T>;

export const usePagedQuery = <T>(useQuery: PagedQueryHook<T>, filters: Query = {}, pageSize: number = PAGE_SIZE.default) => {
  const filterKey = JSON.stringify(filters);
  const [paging, setPaging] = useState({ page: 1, filterKey });
  const page = paging.filterKey === filterKey ? paging.page : 1;
  const { data, isFetching, error, refetch } = useQuery({ ...filters, page, pageSize });

  return {
    rows: data?.data ?? [],
    total: data?.total ?? 0,
    page,
    pageSize,
    setPage: (next: number) => setPaging({ page: next, filterKey }),
    loading: isFetching,
    error: getOptionalErrorMessage(error),
    reload: () => {
      refetch();
    },
  };
};

export type PagedList<T> = ReturnType<typeof usePagedQuery<T>>;
