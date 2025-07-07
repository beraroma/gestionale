import React, { useState } from 'react';
import { Database, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

interface ConnectionParams {
  host: string;
  port: string;
  owner: string;
  pwd: string;
}

interface ConnectionFormProps {
  onConnect: (params: ConnectionParams) => void;
  isConnecting: boolean;
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({ onConnect, isConnecting }) => {
  const [params, setParams] = useState<ConnectionParams>({
    host: 'proddb',
    port: '1521',
    owner: 'SI_GESTIONALE',
    pwd: 'pippo'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<ConnectionParams>>({});

  const validateForm = () => {
    const newErrors: Partial<ConnectionParams> = {};
    
    if (!params.host.trim()) newErrors.host = 'Host è richiesto';
    if (!params.port.trim()) newErrors.port = 'Port è richiesto';
    if (!params.owner.trim()) newErrors.owner = 'Owner è richiesto';
    if (!params.pwd.trim()) newErrors.pwd = 'Password è richiesta';
    
    if (params.port && !/^\d+$/.test(params.port)) {
      newErrors.port = 'Port deve essere un numero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onConnect(params);
    }
  };

  const handleInputChange = (field: keyof ConnectionParams, value: string) => {
    setParams(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Database className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oracle Database Connection</h1>
          <p className="text-gray-600">Inserisci i parametri di connessione per accedere al database</p>
        </div>

        {/* Connection Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Host */}
            <div>
              <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-1">
                Host
              </label>
              <input
                type="text"
                id="host"
                value={params.host}
                onChange={(e) => handleInputChange('host', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.host ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="es. proddb"
                disabled={isConnecting}
              />
              {errors.host && <p className="text-sm text-red-600 mt-1">{errors.host}</p>}
            </div>

            {/* Port */}
            <div>
              <label htmlFor="port" className="block text-sm font-medium text-gray-700 mb-1">
                Port
              </label>
              <input
                type="text"
                id="port"
                value={params.port}
                onChange={(e) => handleInputChange('port', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.port ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="es. 1521"
                disabled={isConnecting}
              />
              {errors.port && <p className="text-sm text-red-600 mt-1">{errors.port}</p>}
            </div>

            {/* Owner */}
            <div>
              <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
                Owner/Schema
              </label>
              <input
                type="text"
                id="owner"
                value={params.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.owner ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="es. SI_GESTIONALE"
                disabled={isConnecting}
              />
              {errors.owner && <p className="text-sm text-red-600 mt-1">{errors.owner}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="pwd" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="pwd"
                  value={params.pwd}
                  onChange={(e) => handleInputChange('pwd', e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.pwd ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Inserisci password"
                  disabled={isConnecting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={isConnecting}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.pwd && <p className="text-sm text-red-600 mt-1">{errors.pwd}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isConnecting}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connessione in corso...</span>
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  <span>Connetti al Database</span>
                </>
              )}
            </button>
          </form>

          {/* Test Connection Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Parametri di Test</h4>
                <p className="text-sm text-blue-700 mt-1">
                  I parametri precompilati sono configurati per l'ambiente di test. 
                  Modifica i valori se necessario per il tuo ambiente.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Oracle Procedure Monitor v1.0
          </p>
        </div>
      </div>
    </div>
  );
};