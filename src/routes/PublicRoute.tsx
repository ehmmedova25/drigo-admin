import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader } from '@/components/common/loader';
import { COMMON_MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/paths';
import { useAuth } from '@/hooks/useAuth';

export const PublicRoute = () => {
  const { admin, checking } = useAuth();
  const from = (useLocation().state as { from?: string } | null)?.from ?? ROUTES.DASHBOARD;

  if (checking) return <Loader text={COMMON_MESSAGES.CHECKING_SESSION} />;
  return admin ? <Navigate to={from} replace /> : <Outlet />;
};
