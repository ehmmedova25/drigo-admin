import { Button } from '@/components/ui/button';
import { Span } from '@/components/ui/span';
import { Stack } from '@/components/ui/stack';

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export const Pagination = ({ page, pageSize, total, onChange }: PaginationProps) => {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <Stack direction="row" align="center" justify="between" gap="sm" wrap>
      <Span color="var(--text-muted)">
        {from}–{to} of {total}
      </Span>
      <Stack direction="row" align="center" gap="xs">
        <Button size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Prev
        </Button>
        <Span color="var(--text-label)" weight="400">
          {page} / {pages}
        </Span>
        <Button size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
};
