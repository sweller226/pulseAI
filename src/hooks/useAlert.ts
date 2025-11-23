import { useState, useEffect, useCallback } from 'react';
import { api, AlertResponse } from '../lib/api';

interface UseAlertResult {
    alertActive: boolean;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useAlert = (refreshInterval: number = 3000): UseAlertResult => {
    const [alertActive, setAlertActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAlert = useCallback(async () => {
        try {
            const data = await api.getAlertStatus();
            setAlertActive(data.alert_active);
            setError(null);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch alert status');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Initial fetch
        fetchAlert();

        // Set up auto-refresh
        const interval = setInterval(fetchAlert, refreshInterval);

        // Cleanup
        return () => clearInterval(interval);
    }, [fetchAlert, refreshInterval]);

    return {
        alertActive,
        loading,
        error,
        refetch: fetchAlert,
    };
};
