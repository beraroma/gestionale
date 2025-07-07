import React, { useState } from 'react';
import { X, Play, AlertCircle } from 'lucide-react';
import { OracleProcedure, ProcedureExecution } from '../types';

interface ExecutionModalProps {
  procedure: OracleProcedure;
  onClose: () => void;
  onExecute: (execution: ProcedureExecution) => void;
}

export const ExecutionModal: React.FC<ExecutionModalProps> = ({ 
  procedure, 
  onClose, 
  onExecute 
}) => {
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);

  const handleParameterChange = (paramName: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const executePrimaProcedura = (params: any) => {
    const numero1 = parseFloat(params.p_numero1) || 0;
    const numero2 = parseFloat(params.p_numero2) || 0;
    const operazione = params.p_operazione || 'SOMMA';

    // Simula l'eccezione Oracle se entrambi i numeri sono 0
    if (numero1 === 0 && numero2 === 0) {
      throw new Error('ORA-20001: Errore: entrambi i parametri non possono essere 0');
    }

    let risultato: number;
    switch (operazione) {
      case 'SOMMA':
        risultato = numero1 + numero2;
        break;
      case 'SOTTRAZIONE':
        risultato = numero1 - numero2;
        break;
      case 'MOLTIPLICAZIONE':
        risultato = numero1 * numero2;
        break;
      default:
        throw new Error('ORA-20002: Operazione non supportata');
    }

    return {
      p_risultato: risultato,
      message: `Operazione ${operazione} completata: ${numero1} ${getOperationSymbol(operazione)} ${numero2} = ${risultato}`
    };
  };

  const getOperationSymbol = (operation: string) => {
    switch (operation) {
      case 'SOMMA': return '+';
      case 'SOTTRAZIONE': return '-';
      case 'MOLTIPLICAZIONE': return '×';
      default: return '?';
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    
    // Crea un ID unico per l'esecuzione
    const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Crea l'esecuzione iniziale in stato RUNNING
    const execution: ProcedureExecution = {
      id: executionId,
      procedureId: procedure.id,
      procedureName: procedure.name,
      status: 'RUNNING',
      startTime: new Date(),
      parameters,
      userId: 'current_user'
    };

    // Aggiungi immediatamente l'esecuzione in stato RUNNING
    onExecute(execution);
    
    // Chiudi il modal immediatamente dopo aver avviato l'esecuzione
    onClose();
    
    // Durata estesa per PrimaProcedura: 2 minuti (120 secondi)
    const executionDuration = procedure.name === 'PrimaProcedura' ? 120000 : 1500;
    
    // Simula l'esecuzione asincrona
    setTimeout(() => {
      try {
        let output;
        
        // Logica specifica per PrimaProcedura
        if (procedure.name === 'PrimaProcedura') {
          output = executePrimaProcedura(parameters);
        } else {
          // Logica generica per altre procedure
          const isSuccess = Math.random() > 0.2; // 80% success rate
          if (!isSuccess) {
            throw new Error('ORA-00001: unique constraint violated');
          }
          output = {
            message: 'Procedure executed successfully',
            rowsAffected: Math.floor(Math.random() * 100) + 1
          };
        }

        // Aggiorna l'esecuzione con il risultato di successo
        const completedExecution: ProcedureExecution = {
          ...execution,
          status: 'COMPLETED',
          endTime: new Date(),
          duration: executionDuration,
          output: output
        };
        
        onExecute(completedExecution);
        
      } catch (error) {
        // Aggiorna l'esecuzione con l'errore
        const failedExecution: ProcedureExecution = {
          ...execution,
          status: 'FAILED',
          endTime: new Date(),
          duration: executionDuration,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        
        onExecute(failedExecution);
      }
      
      setIsExecuting(false);
    }, executionDuration);
  };

  const getInputType = (paramType: string) => {
    switch (paramType) {
      case 'NUMBER':
        return 'number';
      case 'DATE':
        return 'date';
      default:
        return 'text';
    }
  };

  const renderParameterInput = (param: any) => {
    // Campo speciale per il menu delle operazioni
    if (param.name === 'p_operazione' && procedure.name === 'PrimaProcedura') {
      return (
        <select
          value={parameters[param.name] || param.defaultValue || 'SOMMA'}
          onChange={(e) => handleParameterChange(param.name, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          required={param.required}
        >
          <option value="SOMMA">Somma (+)</option>
          <option value="SOTTRAZIONE">Sottrazione (-)</option>
          <option value="MOLTIPLICAZIONE">Moltiplicazione (×)</option>
        </select>
      );
    }

    // Input standard per altri parametri
    if (param.type === 'CLOB') {
      return (
        <textarea
          rows={3}
          value={parameters[param.name] || param.defaultValue || ''}
          onChange={(e) => handleParameterChange(param.name, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder={param.description}
        />
      );
    }

    return (
      <input
        type={getInputType(param.type)}
        value={parameters[param.name] || param.defaultValue || ''}
        onChange={(e) => handleParameterChange(param.name, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        placeholder={param.description}
        required={param.required}
        step={param.type === 'NUMBER' ? 'any' : undefined}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Esegui Procedura</h2>
            <p className="text-sm text-gray-600">{procedure.schema}.{procedure.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Descrizione</h3>
            <p className="text-sm text-gray-600">{procedure.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Parametri di Input</h3>
            
            {procedure.parameters.filter(p => p.direction === 'IN' || p.direction === 'INOUT').map((param) => (
              <div key={param.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {param.name === 'p_numero1' ? 'Primo Numero' :
                   param.name === 'p_numero2' ? 'Secondo Numero' :
                   param.name === 'p_operazione' ? 'Operazione' :
                   param.name}
                  {param.required && <span className="text-red-500 ml-1">*</span>}
                  <span className="text-xs text-gray-500 ml-2">({param.type})</span>
                </label>
                
                {renderParameterInput(param)}
                
                {param.description && (
                  <p className="text-xs text-gray-500">{param.description}</p>
                )}
              </div>
            ))}
          </div>

          {procedure.parameters.some(p => p.direction === 'OUT' || p.direction === 'INOUT') && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Parametri di Output</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Questa procedura restituirà valori per: {' '}
                    {procedure.parameters
                      .filter(p => p.direction === 'OUT' || p.direction === 'INOUT')
                      .map(p => p.name === 'p_risultato' ? 'Risultato' : p.name)
                      .join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {procedure.name === 'PrimaProcedura' && (
            <div className="mt-4 space-y-3">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900">Attenzione</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Se entrambi i numeri sono 0, la procedura genererà un'eccezione Oracle.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-purple-900">Durata Esecuzione</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Questa procedura richiede circa 2 minuti per l'esecuzione. Perfetto per testare il monitoraggio delle procedure a lunga durata.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>{isExecuting ? 'Avvio...' : 'Esegui'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};