import { useEffect, useState } from "react";

export const CONFIG = {
  BASE_URL: "http://192.168.0.2:3005",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  headersFormData: {
    Accept: "application/json",
  },
};

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occured"));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setData(null);
    setError(null);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch]);

  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
