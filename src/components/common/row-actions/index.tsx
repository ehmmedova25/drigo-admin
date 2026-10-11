import { Button } from '@/components/ui/button';
import { Stack } from '@/components/ui/stack';

export interface RowAction {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export const RowActions = ({ actions }: { actions: RowAction[] }) => {
  return (
    <Stack direction="row" gap="xs" onClick={(event) => event.stopPropagation()}>
      {actions.map((action) => (
        <Button key={action.label} size="sm" variant={action.danger ? 'danger' : 'outline'} onClick={action.onClick}>
          {action.label}
        </Button>
      ))}
    </Stack>
  );
};
