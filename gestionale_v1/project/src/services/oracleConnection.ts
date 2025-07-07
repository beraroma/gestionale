export interface ConnectionParams {
  host: string;
  port: string;
  owner: string;
  pwd: string;
}

export interface ConnectionResult {
  success: boolean;
  message: string;
  connectionId?: string;
}

// Simula la connessione Oracle
export const connectToOracle = async (params: ConnectionParams): Promise<ConnectionResult> => {
  // Simula il tempo di connessione
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Parametri di test validi
  const validCredentials = {
    host: 'proddb',
    port: '1521',
    owner: 'SI_GESTIONALE',
    pwd: 'pippo'
  };

  // Verifica le credenziali
  const isValid = 
    params.host === validCredentials.host &&
    params.port === validCredentials.port &&
    params.owner === validCredentials.owner &&
    params.pwd === validCredentials.pwd;

  if (isValid) {
    // Salva i parametri di connessione nel localStorage per uso futuro
    localStorage.setItem('oracle-connection', JSON.stringify({
      ...params,
      connectionId: `conn-${Date.now()}`,
      connectedAt: new Date().toISOString()
    }));

    return {
      success: true,
      message: 'Connessione stabilita con successo',
      connectionId: `conn-${Date.now()}`
    };
  } else {
    // Simula diversi tipi di errore in base ai parametri
    if (params.host !== validCredentials.host) {
      return {
        success: false,
        message: 'ORA-12541: TNS:no listener - Host non raggiungibile'
      };
    } else if (params.port !== validCredentials.port) {
      return {
        success: false,
        message: 'ORA-12514: TNS:listener does not currently know of service - Porta non valida'
      };
    } else if (params.owner !== validCredentials.owner || params.pwd !== validCredentials.pwd) {
      return {
        success: false,
        message: 'ORA-01017: invalid username/password; logon denied'
      };
    } else {
      return {
        success: false,
        message: 'ORA-12170: TNS:Connect timeout occurred'
      };
    }
  }
};

// Verifica se esiste una connessione attiva
export const checkExistingConnection = (): boolean => {
  const connection = localStorage.getItem('oracle-connection');
  return !!connection;
};

// Ottieni i dettagli della connessione corrente
export const getCurrentConnection = (): any => {
  const connection = localStorage.getItem('oracle-connection');
  return connection ? JSON.parse(connection) : null;
};

// Disconnetti
export const disconnect = (): void => {
  localStorage.removeItem('oracle-connection');
  localStorage.removeItem('oracle-executions');
};