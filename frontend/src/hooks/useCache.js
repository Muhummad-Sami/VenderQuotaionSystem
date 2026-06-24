// frontend/src/hooks/useCache.js
import { useState, useEffect } from 'react';

const CACHE_DURATION = 60000; // 1 minute

export const useCache = (key, fetchFn, duration = CACHE_DURATION) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cached = sessionStorage.getItem(key);
    const cachedData = cached ? JSON.parse(cached) : null;
    
    if (cachedData && (Date.now() - cachedData.timestamp < duration)) {
      setData(cachedData.data);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFn();
        setData(result);
        sessionStorage.setItem(key, JSON.stringify({
          data: result,
          timestamp: Date.now()
        }));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, fetchFn, duration]);

  return { data, loading, error };
};