export interface OracleParameter {
  name: string;
  type: 'VARCHAR2' | 'NUMBER' | 'DATE' | 'CLOB' | 'BLOB' | 'CURSOR';
  direction: 'IN' | 'OUT' | 'INOUT';
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface OracleProcedure {
  id: string;
  name: string;
  schema: string;
  description: string;
  parameters: OracleParameter[];
  lastExecuted?: Date;
  executionCount: number;
  avgExecutionTime: number;
}

export interface ProcedureExecution {
  id: string;
  procedureId: string;
  procedureName: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  parameters: Record<string, any>;
  output?: any;
  error?: string;
  userId: string;
}

export interface ExecutionStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  avgExecutionTime: number;
  activeExecutions: number;
}