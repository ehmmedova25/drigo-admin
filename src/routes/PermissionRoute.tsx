import { Outlet } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Paragraph } from '@/components/ui/paragraph';
import { COMMON_MESSAGES } from '@/constants/messages';
import { useAuth } from '@/hooks/useAuth';
import type { Permission } from '@/types/auth.types';

export interface PermissionRouteProps {
  permission: Permission;
}

export const PermissionRoute = ({ permission }: PermissionRouteProps) => {
  const { can } = useAuth();
  if (can(permission)) return <Outlet />;

  return (
    <Card title="No access">
      <Paragraph>{COMMON_MESSAGES.NO_ACCESS}</Paragraph>
    </Card>
  );
};
