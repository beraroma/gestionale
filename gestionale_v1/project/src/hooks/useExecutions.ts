import { useState, useEffect } from 'react';
import { ProcedureExecution, ExecutionStats } from '../types';
import { mockExecutions } from '../data/mockData';

export const useExecutions = () => {
  const [executions, setExecutions] = useState<ProcedureExecution[]>(() => {
    // Carica le esecuzioni dal localStorage se disponibili
    const saved = localStorage.getItem('oracle-executions');
    return saved ? JSON.parse(saved, (key, value) => {
      // Converte le date da string a Date objects
      if (key === 'startTime' || key === 'endTime') {
        return value ? new Date(value) : value;
      }
      return value;
    }) : mockExecutions;
  });

  const [stats, setStats] = useState<ExecutionStats>({
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    avgExecutionTime: 0,
    activeExecutions: 0
  });

  // Salva le esecuzioni nel localStorage ogni volta che cambiano
  useEffect(() => {
    localStorage.setItem('oracle-executions', JSON.stringify(executions));
  }, [executions]);

  useEffect(() => {
    const calculateStats = () => {
      const totalExecutions = executions.length;
      const successfulExecutions = executions.filter(e => e.status === 'COMPLETED').length;
      const failedExecutions = executions.filter(e => e.status === 'FAILED').length;
      const activeExecutions = executions.filter(e => e.status === 'RUNNING' || e.status === 'PENDING').length;
      
      const completedExecutions = executions.filter(e => e.duration);
      const avgExecutionTime = completedExecutions.length > 0 
        ? completedExecutions.reduce((sum, e) => sum + (e.duration || 0), 0) / completedExecutions.length
        : 0;

      setStats({
        totalExecutions,
        successfulExecutions,
        failedExecutions,
        avgExecutionTime,
        activeExecutions
      });
    };

    calculateStats();
  }, [executions]);

  const addExecution = (execution: ProcedureExecution) => {
    setExecutions(prev => {
      // Controlla se l'esecuzione esiste già
      const existingIndex = prev.findIndex(e => e.id === execution.id);
      
      if (existingIndex >= 0) {
        // Aggiorna l'esecuzione esistente
        const updated = [...prev];
        updated[existingIndex] = execution;
        return updated;
      } else {
        // Aggiungi nuova esecuzione all'inizio della lista
        return [execution, ...prev];
      }
    });
  };

  const updateExecution = (id: string, updates: Partial<ProcedureExecution>) => {
    setExecutions(prev => prev.map(exec => 
      exec.id === id ? { ...exec, ...updates } : exec
    ));
  };

  const clearExecutions = () => {
    setExecutions([]);
    localStorage.removeItem('oracle-executions');
  };

  return {
    executions,
    stats,
    addExecution,
    updateExecution,
    clearExecutions
  };
};