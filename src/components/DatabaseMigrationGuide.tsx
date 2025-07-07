import React from 'react';
import { Database, ArrowRight, Code, CheckCircle } from 'lucide-react';

export const DatabaseMigrationGuide: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Database className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Guida Migrazione Oracle</h3>
          <p className="text-sm text-gray-600">Come passare da SQLite a Oracle in produzione</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">1</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Modifica il Database Service</h4>
            <p className="text-sm text-gray-600 mt-1">
              Sostituisci <code className="bg-gray-100 px-1 rounded">better-sqlite3</code> con il driver Oracle (es. <code className="bg-gray-100 px-1 rounded">oracledb</code>)
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">2</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Aggiorna le Query</h4>
            <p className="text-sm text-gray-600 mt-1">
              Le query sono già predisposte per Oracle. Sostituisci le tabelle locali con le viste Oracle:
            </p>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <code className="text-xs text-gray-700">
                ALL_PROCEDURES, ALL_ARGUMENTS, USER_PROCEDURES
              </code>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">3</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Configurazione Connessione</h4>
            <p className="text-sm text-gray-600 mt-1">
              Il sistema di connessione è già predisposto per Oracle. Basta aggiornare i parametri di connessione.
            </p>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-900">Vantaggi dell'Approccio</h4>
              <ul className="text-sm text-green-700 mt-1 space-y-1">
                <li>• Sviluppo e test senza dipendenze Oracle</li>
                <li>• Struttura dati identica tra sviluppo e produzione</li>
                <li>• Migrazione semplice e sicura</li>
                <li>• Possibilità di test offline</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};