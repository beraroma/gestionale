import { OracleProcedure } from '../types';
import { getDatabase } from './database';

export class ProcedureService {
  private db = getDatabase();

  // Carica tutte le procedure dal database
  public async loadProcedures(): Promise<OracleProcedure[]> {
    try {
      return this.db.getAllProcedures();
    } catch (error) {
      console.error('Errore nel caricamento delle procedure:', error);
      throw new Error('Impossibile caricare le procedure dal database');
    }
  }

  // Aggiorna le statistiche di esecuzione di una procedura
  public async updateExecutionStats(procedureId: string, executionTime: number): Promise<void> {
    try {
      this.db.updateProcedureStats(procedureId, executionTime);
    } catch (error) {
      console.error('Errore nell\'aggiornamento delle statistiche:', error);
    }
  }

  // Aggiunge una nuova procedura
  public async addProcedure(procedure: Omit<OracleProcedure, 'id' | 'executionCount' | 'avgExecutionTime'>): Promise<string> {
    try {
      return this.db.addProcedure(procedure);
    } catch (error) {
      console.error('Errore nell\'aggiunta della procedura:', error);
      throw new Error('Impossibile aggiungere la procedura');
    }
  }

  // Elimina una procedura
  public async deleteProcedure(procedureId: string): Promise<boolean> {
    try {
      return this.db.deleteProcedure(procedureId);
    } catch (error) {
      console.error('Errore nell\'eliminazione della procedura:', error);
      throw new Error('Impossibile eliminare la procedura');
    }
  }

  // Ottieni statistiche database
  public async getDatabaseStats() {
    try {
      return {
        totalProcedures: this.db.getProcedureCount(),
        schemas: this.db.getSchemas()
      };
    } catch (error) {
      console.error('Errore nel caricamento delle statistiche:', error);
      return { totalProcedures: 0, schemas: [] };
    }
  }

  // Simula la query Oracle per il deploy futuro
  public getOracleQuery(): string {
    return `
      -- Query Oracle equivalente per il deploy in produzione
      SELECT 
        p.object_name as name,
        p.owner as schema,
        c.comments as description,
        p.created,
        p.last_ddl_time
      FROM all_procedures p
      LEFT JOIN all_tab_comments c ON c.table_name = p.object_name 
        AND c.owner = p.owner
      WHERE p.owner = 'SI_GESTIONALE'
        AND p.object_type = 'PROCEDURE'
      ORDER BY p.object_name;

      -- Per i parametri:
      SELECT 
        argument_name as name,
        data_type as type,
        in_out as direction,
        default_value,
        position
      FROM all_arguments
      WHERE owner = 'SI_GESTIONALE'
        AND package_name IS NULL
        AND object_name = :procedure_name
      ORDER BY position;
    `;
  }
}

// Singleton instance
let procedureServiceInstance: ProcedureService | null = null;

export const getProcedureService = (): ProcedureService => {
  if (!procedureServiceInstance) {
    procedureServiceInstance = new ProcedureService();
  }
  return procedureServiceInstance;
};