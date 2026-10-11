import { getOptionalErrorMessage } from './apiError';

interface ListQueryResult<T> {
  data?: T[];
  isFetching: boolean;
  error?: unknown;
  refetch: () => unknown;
}

interface QueryStatus {
  error?: unknown;
  isFetching: boolean;
  refetch: () => unknown;
}

export interface ListState<T> {
  rows: T[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export const toListState = <T>({ data, isFetching, error, refetch }: ListQueryResult<T>): ListState<T> => ({
  rows: data ?? [],
  loading: isFetching,
  error: getOptionalErrorMessage(error),
  reload: () => {
    refetch();
  },
});

export const combineQueries = (queries: QueryStatus[]) => ({
  loading: queries.some((query) => query.isFetching),
  error: queries.find((query) => query.error && !query.isFetching)?.error,
  reload: () => {
    queries.forEach((query) => query.refetch());
  },
});
