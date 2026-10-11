import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader } from '@/components/common/loader';
import { COMMON_MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/paths';
import { useAuth } from '@/hooks/useAuth';

export const PrivateRoute = () => {
  const { admin, checking } = useAuth();
  const location = useLocation();

  if (checking) return <Loader text={COMMON_MESSAGES.CHECKING_SESSION} />;
  if (!admin) return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  return <Outlet />;
};
