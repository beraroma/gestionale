import Database from 'better-sqlite3';
import { OracleProcedure, OracleParameter } from '../types';

// Configurazione database
const DB_PATH = './oracle_procedures.db';

class DatabaseService {
  private db: Database.Database;

  constructor() {
    this.db = new Database(DB_PATH);
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Crea le tabelle se non esistono
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS procedures (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        schema_name TEXT NOT NULL,
        description TEXT,
        last_executed TEXT,
        execution_count INTEGER DEFAULT 0,
        avg_execution_time INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS procedure_parameters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        procedure_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        direction TEXT NOT NULL,
        required INTEGER DEFAULT 0,
        default_value TEXT,
        description TEXT,
        FOREIGN KEY (procedure_id) REFERENCES procedures (id)
      );
    `);

    // Inserisci dati di esempio se la tabella è vuota
    const count = this.db.prepare('SELECT COUNT(*) as count FROM procedures').get() as { count: number };
    
    if (count.count === 0) {
      this.seedDatabase();
    }
  }

  private seedDatabase() {
    console.log('Inizializzazione database con dati di esempio...');
    
    const insertProcedure = this.db.prepare(`
      INSERT INTO procedures (id, name, schema_name, description, execution_count, avg_execution_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertParameter = this.db.prepare(`
      INSERT INTO procedure_parameters (procedure_id, name, type, direction, required, default_value, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // Procedure 1: PrimaProcedura
    insertProcedure.run(
      '1',
      'PrimaProcedura',
      'MATH',
      'Esegue operazioni matematiche di base tra due numeri. Durata: ~2 minuti. Restituisce eccezione se entrambi i parametri sono 0.',
      0,
      0
    );

    insertParameter.run('1', 'p_numero1', 'NUMBER', 'IN', 1, null, 'Primo numero per l\'operazione');
    insertParameter.run('1', 'p_numero2', 'NUMBER', 'IN', 1, null, 'Secondo numero per l\'operazione');
    insertParameter.run('1', 'p_operazione', 'VARCHAR2', 'IN', 1, 'SOMMA', 'Tipo di operazione (SOMMA, SOTTRAZIONE, MOLTIPLICAZIONE)');
    insertParameter.run('1', 'p_risultato', 'NUMBER', 'OUT', 0, null, 'Risultato dell\'operazione matematica');

    // Procedure 2: GET_EMPLOYEE_DETAILS
    insertProcedure.run(
      '2',
      'GET_EMPLOYEE_DETAILS',
      'HR',
      'Retrieve detailed employee information including department and salary',
      0,
      0
    );

    insertParameter.run('2', 'p_employee_id', 'NUMBER', 'IN', 1, null, 'Employee ID to retrieve details for');
    insertParameter.run('2', 'p_include_salary', 'VARCHAR2', 'IN', 0, 'N', 'Include salary information (Y/N)');
    insertParameter.run('2', 'p_result_cursor', 'CURSOR', 'OUT', 0, null, 'Result cursor with employee details');

    // Procedure 3: UPDATE_SALARY
    insertProcedure.run(
      '3',
      'UPDATE_SALARY',
      'HR',
      'Update employee salary with approval workflow',
      0,
      0
    );

    insertParameter.run('3', 'p_employee_id', 'NUMBER', 'IN', 1, null, 'Employee ID');
    insertParameter.run('3', 'p_new_salary', 'NUMBER', 'IN', 1, null, 'New salary amount');
    insertParameter.run('3', 'p_effective_date', 'DATE', 'IN', 1, null, 'Effective date for salary change');
    insertParameter.run('3', 'p_approval_status', 'VARCHAR2', 'OUT', 0, null, 'Approval status result');

    // Procedure 4: GENERATE_MONTHLY_REPORT
    insertProcedure.run(
      '4',
      'GENERATE_MONTHLY_REPORT',
      'REPORTS',
      'Generate comprehensive monthly financial report',
      0,
      0
    );

    insertParameter.run('4', 'p_month', 'NUMBER', 'IN', 1, null, 'Month (1-12)');
    insertParameter.run('4', 'p_year', 'NUMBER', 'IN', 1, null, 'Year (YYYY)');
    insertParameter.run('4', 'p_department_id', 'NUMBER', 'IN', 0, null, 'Optional department filter');
    insertParameter.run('4', 'p_report_data', 'CLOB', 'OUT', 0, null, 'Generated report data');

    // Procedure 5: PROCESS_BATCH_TRANSACTIONS
    insertProcedure.run(
      '5',
      'PROCESS_BATCH_TRANSACTIONS',
      'FINANCE',
      'Process batch of financial transactions with validation',
      0,
      0
    );

    insertParameter.run('5', 'p_batch_id', 'VARCHAR2', 'IN', 1, null, 'Batch identifier');
    insertParameter.run('5', 'p_validation_mode', 'VARCHAR2', 'IN', 0, 'STRICT', 'Validation mode (STRICT/LENIENT)');
    insertParameter.run('5', 'p_processed_count', 'NUMBER', 'OUT', 0, null, 'Number of processed transactions');
    insertParameter.run('5', 'p_error_count', 'NUMBER', 'OUT', 0, null, 'Number of failed transactions');

    console.log('Database inizializzato con successo!');
  }

  public getAllProcedures(): OracleProcedure[] {
    const procedures = this.db.prepare(`
      SELECT 
        id,
        name,
        schema_name as schema,
        description,
        last_executed,
        execution_count,
        avg_execution_time
      FROM procedures
      ORDER BY name
    `).all();

    return procedures.map((proc: any) => {
      const parameters = this.getProcedureParameters(proc.id);
      
      return {
        id: proc.id,
        name: proc.name,
        schema: proc.schema,
        description: proc.description || '',
        parameters,
        lastExecuted: proc.last_executed ? new Date(proc.last_executed) : undefined,
        executionCount: proc.execution_count || 0,
        avgExecutionTime: proc.avg_execution_time || 0
      };
    });
  }

  private getProcedureParameters(procedureId: string): OracleParameter[] {
    const parameters = this.db.prepare(`
      SELECT 
        name,
        type,
        direction,
        required,
        default_value,
        description
      FROM procedure_parameters
      WHERE procedure_id = ?
      ORDER BY id
    `).all(procedureId);

    return parameters.map((param: any) => ({
      name: param.name,
      type: param.type as any,
      direction: param.direction as any,
      required: Boolean(param.required),
      defaultValue: param.default_value,
      description: param.description
    }));
  }

  public updateProcedureStats(procedureId: string, executionTime: number) {
    const current = this.db.prepare(`
      SELECT execution_count, avg_execution_time 
      FROM procedures 
      WHERE id = ?
    `).get(procedureId) as any;

    if (current) {
      const newCount = current.execution_count + 1;
      const newAvg = Math.round(
        (current.avg_execution_time * current.execution_count + executionTime) / newCount
      );

      this.db.prepare(`
        UPDATE procedures 
        SET 
          execution_count = ?,
          avg_execution_time = ?,
          last_executed = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(newCount, newAvg, procedureId);
    }
  }

  public addProcedure(procedure: Omit<OracleProcedure, 'id' | 'executionCount' | 'avgExecutionTime'>) {
    const id = `proc-${Date.now()}`;
    
    const insertProcedure = this.db.prepare(`
      INSERT INTO procedures (id, name, schema_name, description)
      VALUES (?, ?, ?, ?)
    `);

    const insertParameter = this.db.prepare(`
      INSERT INTO procedure_parameters (procedure_id, name, type, direction, required, default_value, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertProcedure.run(id, procedure.name, procedure.schema, procedure.description);

    procedure.parameters.forEach(param => {
      insertParameter.run(
        id,
        param.name,
        param.type,
        param.direction,
        param.required ? 1 : 0,
        param.defaultValue,
        param.description
      );
    });

    return id;
  }

  public close() {
    this.db.close();
  }
}

// Singleton instance
let dbInstance: DatabaseService | null = null;

export const getDatabase = (): DatabaseService => {
  if (!dbInstance) {
    dbInstance = new DatabaseService();
  }
  return dbInstance;
};

export const closeDatabase = () => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
};