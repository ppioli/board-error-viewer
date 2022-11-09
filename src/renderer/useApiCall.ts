import { ApiResult } from '../model/ApiResult';
import { useEffect, useState } from 'react';

export interface UseApiCallOpts<T> {
  call: () => Promise<ApiResult<T>>;
}
export function useApiCall<T>({ call }: UseApiCallOpts<T>) {
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    call().then(({ error, result }) => {
      setLoading(false);
      if (error !== null) {
        setError(error);
      }
      if (result !== null) {
        setResult(result);
      }
    });
  }, [call]);

  return {
    loading,
    result,
    error,
  };
}
