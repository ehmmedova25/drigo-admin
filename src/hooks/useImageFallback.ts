import { useState } from 'react';

export const useImageFallback = (sources: (string | null | undefined)[]) => {
  const available = sources.filter((src): src is string => Boolean(src));
  const [failedCount, setFailedCount] = useState(0);

  return { src: available[failedCount], onError: () => setFailedCount((count) => count + 1) };
};
