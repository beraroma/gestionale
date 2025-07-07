import React from 'react';
import { Activity, Clock, CheckCircle, XCircle, Play } from 'lucide-react';
import { ExecutionStats } from '../types';
import { StatsCard } from './StatsCard';

interface DashboardProps {
  stats: ExecutionStats;
  onNavigate: (tab: 'procedures' | 'executions') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, onNavigate }) => {
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const successRate = stats.totalExecutions > 0 
    ? ((stats.successfulExecutions / stats.totalExecutions) * 100).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatsCard
        title="Total Executions"
        value={stats.totalExecutions}
        icon={Activity}
        color="bg-blue-500"
        onClick={() => onNavigate('executions')}
        clickable={stats.totalExecutions > 0}
      />
      
      <StatsCard
        title="Successful"
        value={stats.successfulExecutions}
        icon={CheckCircle}
        color="bg-green-500"
        subtitle={`${successRate}% success rate`}
        onClick={() => onNavigate('executions')}
        clickable={stats.successfulExecutions > 0}
      />
      
      <StatsCard
        title="Failed"
        value={stats.failedExecutions}
        icon={XCircle}
        color="bg-red-500"
        onClick={() => onNavigate('executions')}
        clickable={stats.failedExecutions > 0}
      />
      
      <StatsCard
        title="Active"
        value={stats.activeExecutions}
        icon={Play}
        color="bg-yellow-500"
        onClick={() => onNavigate('executions')}
        clickable={stats.activeExecutions > 0}
      />
      
      <StatsCard
        title="Avg Duration"
        value={formatTime(stats.avgExecutionTime)}
        icon={Clock}
        color="bg-purple-500"
        onClick={() => onNavigate('executions')}
        clickable={stats.totalExecutions > 0}
      />
    </div>
  );
};