import { useState, useEffect, useCallback } from 'react';
import { api, VitalsResponse } from '../lib/api';

interface UseVitalsResult {
    vitals: VitalsResponse | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useVitals = (refreshInterval: number = 2000): UseVitalsResult => {
    const [vitals, setVitals] = useState<VitalsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVitals = useCallback(async () => {
        try {
            const data = await api.getCurrentVitals();
            setVitals(data);
            setError(null);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch vitals');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Initial fetch
        fetchVitals();

        // Set up auto-refresh
        const interval = setInterval(fetchVitals, refreshInterval);

        // Cleanup
        return () => clearInterval(interval);
    }, [fetchVitals, refreshInterval]);

    return {
        vitals,
        loading,
        error,
        refetch: fetchVitals,
    };
};
