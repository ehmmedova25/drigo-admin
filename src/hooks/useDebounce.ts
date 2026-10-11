import { useEffect, useState } from 'react';
import { TIMING } from '@/constants/config';

export const useDebounce = <T>(value: T, delayMs: number = TIMING.searchDebounceMs): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
};
