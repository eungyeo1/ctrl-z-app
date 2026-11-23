// API를 불러오며 로딩·에러 상태를 함께 관리하는 훅
// 사용 예: const { data, loading, error, reload } = useApi(() => getBook(bookId), [bookId]);
import { useCallback, useEffect, useState, type DependencyList } from "react";

import type { ApiError, ApiResponse } from "@/types/models";

export function useApi<T>(fetcher: () => Promise<ApiResponse<T>>, deps: DependencyList) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(fetcher, deps);

  const reload = useCallback(async () => {
    setLoading(true);
    const res = await load();
    setData(res.data);
    setError(res.success ? null : res.error);
    setLoading(false);
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    load().then((res) => {
      if (cancelled) return;
      setData(res.data);
      setError(res.success ? null : res.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  return { data, error, loading, reload };
}
