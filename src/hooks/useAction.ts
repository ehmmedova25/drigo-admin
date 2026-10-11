import { useState } from 'react';
import { getErrorMessage } from '@/utils/apiError';
import { useToast } from './useToast';

export const useAction = (onSuccess?: () => void) => {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const run = async <R,>(action: () => Promise<R>, successMessage: string | ((result: R) => string)): Promise<boolean> => {
    setBusy(true);
    try {
      const result = await action();
      toast.success(typeof successMessage === 'function' ? successMessage(result) : successMessage);
      onSuccess?.();
      return true;
    } catch (e) {
      toast.error(getErrorMessage(e));
      return false;
    } finally {
      setBusy(false);
    }
  };

  return { run, busy };
};
