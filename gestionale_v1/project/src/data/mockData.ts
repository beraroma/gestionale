import { OracleProcedure, ProcedureExecution } from '../types';

export const mockProcedures: OracleProcedure[] = [
  {
    id: '1',
    name: 'PrimaProcedura',
    schema: 'MATH',
    description: 'Esegue operazioni matematiche di base tra due numeri. Durata: ~2 minuti. Restituisce eccezione se entrambi i parametri sono 0.',
    parameters: [
      {
        name: 'p_numero1',
        type: 'NUMBER',
        direction: 'IN',
        required: true,
        description: 'Primo numero per l\'operazione'
      },
      {
        name: 'p_numero2',
        type: 'NUMBER',
        direction: 'IN',
        required: true,
        description: 'Secondo numero per l\'operazione'
      },
      {
        name: 'p_operazione',
        type: 'VARCHAR2',
        direction: 'IN',
        required: true,
        description: 'Tipo di operazione (SOMMA, SOTTRAZIONE, MOLTIPLICAZIONE)',
        defaultValue: 'SOMMA'
      },
      {
        name: 'p_risultato',
        type: 'NUMBER',
        direction: 'OUT',
        required: false,
        description: 'Risultato dell\'operazione matematica'
      }
    ],
    lastExecuted: undefined,
    executionCount: 0,
    avgExecutionTime: 0
  },
  {
    id: '2',
    name: 'GET_EMPLOYEE_DETAILS',
    schema: 'HR',
    description: 'Retrieve detailed employee information including department and salary',
    parameters: [
      {
        name: 'p_employee_id',
        type: 'NUMBER',
        direction: 'IN',
        required: true,
        description: 'Employee ID to retrieve details for'
      },
      {
        name: 'p_include_salary',
        type: 'VARCHAR2',
        direction: 'IN',
        required: false,
        defaultValue: 'N',
        description: 'Include salary information (Y/N)'
      },
      {
        name: 'p_result_cursor',
        type: 'CURSOR',
        direction: 'OUT',
        required: false,
        description: 'Result cursor with employee details'
      }
    ],
    lastExecuted: undefined,
    executionCount: 0,
    avgExecutionTime: 0
  },
  {
    id: '3',
    name: 'UPDATE_SALARY',
    schema: 'HR',
    description: 'Update employee salary with approval workflow',
    parameters: [
      {
        name: 'p_employee_id',
        type: 'NUMBER',
        direction: 'IN',
        required: true,
        description: 'Employee ID'
      },
      {
        name: 'p_new_salary',
        type: 'NUMBER',
        direction: 'IN',
        required: true,
        description: 'New salary amount'
      },
      {
        name: 'p_effective_date',
        type: 'DATE',
        direction: 'IN',
        required: true,
        description: 'Effective date for salary change'
      },
      {
        name: 'p_approval_status',
        type: 'VARCHAR2',
        direction: 'OUT',
        required: false,
        description: 'Approval status result'
      }
    ],
    lastExecuted: undefined,
    executionCount: 0,
    avgExecutionTime: 0
  },
  {
    id: '4',
    name: 'GENERATE_MONTHLY_REPORT',
    schema: 'REPORTS',
    description: 'Generate comprehensive monthly financial report',
    parameters: [
      {
        name: 'p_month',
        type: 'NUMBER',
        direction: 'IN',
        required: true,
        description: 'Month (1-12)'
      },
      {
        name: 'p_year',
        type: 'NUMBER',
        direction: 'IN',
        required: true,
        description: 'Year (YYYY)'
      },
      {
        name: 'p_department_id',
        type: 'NUMBER',
        direction: 'IN',
        required: false,
        description: 'Optional department filter'
      },
      {
        name: 'p_report_data',
        type: 'CLOB',
        direction: 'OUT',
        required: false,
        description: 'Generated report data'
      }
    ],
    lastExecuted: undefined,
    executionCount: 0,
    avgExecutionTime: 0
  },
  {
    id: '5',
    name: 'PROCESS_BATCH_TRANSACTIONS',
    schema: 'FINANCE',
    description: 'Process batch of financial transactions with validation',
    parameters: [
      {
        name: 'p_batch_id',
        type: 'VARCHAR2',
        direction: 'IN',
        required: true,
        description: 'Batch identifier'
      },
      {
        name: 'p_validation_mode',
        type: 'VARCHAR2',
        direction: 'IN',
        required: false,
        defaultValue: 'STRICT',
        description: 'Validation mode (STRICT/LENIENT)'
      },
      {
        name: 'p_processed_count',
        type: 'NUMBER',
        direction: 'OUT',
        required: false,
        description: 'Number of processed transactions'
      },
      {
        name: 'p_error_count',
        type: 'NUMBER',
        direction: 'OUT',
        required: false,
        description: 'Number of failed transactions'
      }
    ],
    lastExecuted: undefined,
    executionCount: 0,
    avgExecutionTime: 0
  }
];

// Array vuoto per iniziare senza esecuzioni
export const mockExecutions: ProcedureExecution[] = [];