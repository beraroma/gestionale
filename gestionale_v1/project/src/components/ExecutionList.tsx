import React from 'react';
import { Clock, CheckCircle, XCircle, Play, User } from 'lucide-react';
import { ProcedureExecution } from '../types';

interface ExecutionListProps {
  executions: ProcedureExecution[];
  onViewDetails: (execution: ProcedureExecution) => void;
}

export const ExecutionList: React.FC<ExecutionListProps> = ({ 
  executions, 
  onViewDetails 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'RUNNING':
        return <Play className="h-5 w-5 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'RUNNING':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  return (
    <div className="space-y-4">
      {executions.map((execution) => (
        <div
          key={execution.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onViewDetails(execution)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(execution.status)}
              <div>
                <h3 className="font-medium text-gray-900">{execution.procedureName}</h3>
                <p className="text-sm text-gray-600">
                  {execution.startTime.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatDuration(execution.duration)}
                </p>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <User className="h-3 w-3" />
                  <span>{execution.userId}</span>
                </div>
              </div>
              
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(execution.status)}`}>
                {execution.status}
              </span>
            </div>
          </div>

          {execution.error && (
            <div className="mt-3 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">{execution.error}</p>
            </div>
          )}

          {execution.output && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                {typeof execution.output === 'string' 
                  ? execution.output 
                  : JSON.stringify(execution.output, null, 2)}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};