import React from 'react';
import { Clock, Database, Play, Settings } from 'lucide-react';
import { OracleProcedure } from '../types';

interface ProcedureCardProps {
  procedure: OracleProcedure;
  onExecute: (procedure: OracleProcedure) => void;
  onViewDetails: (procedure: OracleProcedure) => void;
}

export const ProcedureCard: React.FC<ProcedureCardProps> = ({ 
  procedure, 
  onExecute, 
  onViewDetails 
}) => {
  const formatExecutionTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Database className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{procedure.name}</h3>
            <p className="text-sm text-gray-600">{procedure.schema}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(procedure)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => onExecute(procedure)}
            className="p-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors group-hover:scale-105"
          >
            <Play className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{procedure.description}</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Avg: {formatExecutionTime(procedure.avgExecutionTime)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">
            {procedure.executionCount} runs
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {procedure.parameters.length} parameters
          </span>
          {procedure.lastExecuted && (
            <span className="text-xs text-gray-500">
              Last: {new Date(procedure.lastExecuted).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};