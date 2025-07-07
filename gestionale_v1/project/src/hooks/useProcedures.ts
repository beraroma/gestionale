import { useState, useEffect } from 'react';
import { OracleProcedure } from '../types';
import { getProcedureService } from '../services/procedureService';

export const useProcedures = (isConnected: boolean) => {
  const [procedures, setProcedures] = useState<OracleProcedure[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const procedureService = getProcedureService();

  const loadProcedures = async () => {
    if (!isConnected) {
      setProcedures([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loadedProcedures = await procedureService.loadProcedures();
      setProcedures(loadedProcedures);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento delle procedure');
      setProcedures([]);
    } finally {
      setLoading(false);
    }
  };

  const updateProcedureStats = async (procedureId: string, executionTime: number) => {
    try {
      await procedureService.updateExecutionStats(procedureId, executionTime);
      // Ricarica le procedure per aggiornare le statistiche
      await loadProcedures();
    } catch (err) {
      console.error('Errore nell\'aggiornamento delle statistiche:', err);
    }
  };

  const refreshProcedures = () => {
    loadProcedures();
  };

  useEffect(() => {
    loadProcedures();
  }, [isConnected]);

  return {
    procedures,
    loading,
    error,
    refreshProcedures,
    updateProcedureStats
  };
};