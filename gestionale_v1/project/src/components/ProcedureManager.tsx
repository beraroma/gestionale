import React, { useState } from 'react';
import { Plus, Save, X, Database, Settings, Trash2 } from 'lucide-react';
import { OracleProcedure, OracleParameter } from '../types';
import { getProcedureService } from '../services/procedureService';

interface ProcedureManagerProps {
  onProcedureAdded: () => void;
  onClose: () => void;
}

export const ProcedureManager: React.FC<ProcedureManagerProps> = ({ 
  onProcedureAdded, 
  onClose 
}) => {
  const [procedure, setProcedure] = useState({
    name: '',
    schema: 'SI_GESTIONALE',
    description: ''
  });
  
  const [parameters, setParameters] = useState<Omit<OracleParameter, 'name'>[]>([]);
  const [currentParam, setCurrentParam] = useState<OracleParameter>({
    name: '',
    type: 'VARCHAR2',
    direction: 'IN',
    required: false,
    defaultValue: '',
    description: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parameterTypes = ['VARCHAR2', 'NUMBER', 'DATE', 'CLOB', 'BLOB', 'CURSOR'];
  const directions = ['IN', 'OUT', 'INOUT'];
  const schemas = ['SI_GESTIONALE', 'HR', 'FINANCE', 'REPORTS', 'MATH', 'UTILS'];

  const addParameter = () => {
    if (!currentParam.name.trim()) {
      setError('Il nome del parametro è obbligatorio');
      return;
    }

    const newParam = { ...currentParam };
    setParameters(prev => [...prev, newParam]);
    
    // Reset form parametro
    setCurrentParam({
      name: '',
      type: 'VARCHAR2',
      direction: 'IN',
      required: false,
      defaultValue: '',
      description: ''
    });
    setError(null);
  };

  const removeParameter = (index: number) => {
    setParameters(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!procedure.name.trim()) {
      setError('Il nome della procedura è obbligatorio');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const procedureService = getProcedureService();
      
      const newProcedure: Omit<OracleProcedure, 'id' | 'executionCount' | 'avgExecutionTime'> = {
        name: procedure.name.toUpperCase(),
        schema: procedure.schema,
        description: procedure.description,
        parameters: parameters.map(param => ({
          name: param.name,
          type: param.type,
          direction: param.direction,
          required: param.required,
          defaultValue: param.defaultValue || undefined,
          description: param.description || undefined
        }))
      };

      await procedureService.addProcedure(newProcedure);
      onProcedureAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel salvataggio della procedura');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Crea Nuova Procedura</h2>
              <p className="text-sm text-gray-600">Aggiungi una nuova procedura al database SQLite</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informazioni Procedura */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Informazioni Procedura</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Procedura *
                </label>
                <input
                  type="text"
                  value={procedure.name}
                  onChange={(e) => setProcedure(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="es. CALCOLA_STIPENDIO"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schema
                </label>
                <select
                  value={procedure.schema}
                  onChange={(e) => setProcedure(prev => ({ ...prev, schema: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {schemas.map(schema => (
                    <option key={schema} value={schema}>{schema}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrizione
              </label>
              <textarea
                rows={3}
                value={procedure.description}
                onChange={(e) => setProcedure(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descrizione della procedura e della sua funzionalità..."
              />
            </div>
          </div>

          {/* Parametri Esistenti */}
          {parameters.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Parametri Definiti</h3>
              <div className="space-y-2">
                {parameters.map((param, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-gray-900">{param.name}</span>
                      <span className="text-sm text-gray-600">{param.type}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        param.direction === 'IN' ? 'bg-blue-100 text-blue-800' :
                        param.direction === 'OUT' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {param.direction}
                      </span>
                      {param.required && (
                        <span className="text-xs text-red-600">Required</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeParameter(index)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aggiungi Parametro */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Aggiungi Parametro</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Parametro
                </label>
                <input
                  type="text"
                  value={currentParam.name}
                  onChange={(e) => setCurrentParam(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="es. p_employee_id"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={currentParam.type}
                  onChange={(e) => setCurrentParam(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {parameterTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Direzione
                </label>
                <select
                  value={currentParam.direction}
                  onChange={(e) => setCurrentParam(prev => ({ ...prev, direction: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {directions.map(dir => (
                    <option key={dir} value={dir}>{dir}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={currentParam.required}
                    onChange={(e) => setCurrentParam(prev => ({ ...prev, required: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Obbligatorio</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valore Default
                </label>
                <input
                  type="text"
                  value={currentParam.defaultValue}
                  onChange={(e) => setCurrentParam(prev => ({ ...prev, defaultValue: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Valore opzionale di default"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrizione
                </label>
                <input
                  type="text"
                  value={currentParam.description}
                  onChange={(e) => setCurrentParam(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descrizione del parametro"
                />
              </div>
            </div>

            <button
              onClick={addParameter}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Aggiungi Parametro</span>
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
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
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Salvataggio...' : 'Salva Procedura'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};