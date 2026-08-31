import { useCallback, useEffect, useRef, useState } from 'react';
import { listSneakers } from '../api/sneakers';

export function useInfiniteProducts(filters) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sentinelRef = useRef(null);
  const filtersKey = JSON.stringify(filters);
  const filtersKeyRef = useRef(filtersKey);

  useEffect(() => {
    filtersKeyRef.current = filtersKey;
    let cancelled = false;
    setItems([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    setError(null);

    listSneakers({ ...filters, page: 1 })
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setHasMore(data.hasMore);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const requestFiltersKey = filtersKey;
    const nextPage = page + 1;
    setLoading(true);
    listSneakers({ ...filters, page: nextPage })
      .then((data) => {
        if (filtersKeyRef.current !== requestFiltersKey) return;
        setItems((current) => [...current, ...data.items]);
        setHasMore(data.hasMore);
        setPage(nextPage);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, page, loading, hasMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return { items, loading, error, hasMore, sentinelRef };
}
