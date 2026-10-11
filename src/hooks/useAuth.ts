import { baseApi } from '@/api/baseApi';
import { useGetMeQuery, useGetMyPermissionsQuery, useLogoutMutation } from '@/api/endpoints/authApi';
import { useAppDispatch } from '@/store/hooks';
import type { Permission } from '@/types/auth.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const me = useGetMeQuery();
  const admin = me.isError ? null : (me.data ?? null);
  const permissions = useGetMyPermissionsQuery(undefined, { skip: !admin });
  const [logoutRequest] = useLogoutMutation();
  const codes = permissions.data?.permissionCodes ?? [];

  const can = (permission: Permission) => Boolean(admin) && (admin?.isSuperAdmin || codes.includes(permission));

  const logout = async () => {
    try {
      await logoutRequest().unwrap();
    } finally {
      dispatch(baseApi.util.resetApiState());
    }
  };

  return {
    admin,
    checking: me.isLoading || (Boolean(admin) && permissions.isLoading),
    can,
    logout,
  };
};
