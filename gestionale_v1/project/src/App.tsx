import React, { useState, useEffect } from 'react';
import { Database, Activity, Settings, RotateCcw, Play, LogOut } from 'lucide-react';
import { OracleProcedure } from './types';
import { mockProcedures } from './data/mockData';
import { useExecutions } from './hooks/useExecutions';
import { Dashboard } from './components/Dashboard';
import { ProcedureCard } from './components/ProcedureCard';
import { ExecutionModal } from './components/ExecutionModal';
import { ExecutionList } from './components/ExecutionList';
import { ConnectionForm } from './components/ConnectionForm';
import { connectToOracle, checkExistingConnection, getCurrentConnection, disconnect, ConnectionParams } from './services/oracleConnection';

type TabType = 'dashboard' | 'procedures' | 'executions';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionInfo, setConnectionInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedProcedure, setSelectedProcedure] = useState<OracleProcedure | null>(null);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const { executions, stats, addExecution, clearExecutions } = useExecutions();

  // Controlla se esiste una connessione esistente all'avvio
  useEffect(() => {
    const existingConnection = checkExistingConnection();
    if (existingConnection) {
      setIsConnected(true);
      setConnectionInfo(getCurrentConnection());
    }
  }, []);

  const handleConnect = async (params: ConnectionParams) => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      const result = await connectToOracle(params);
      
      if (result.success) {
        setIsConnected(true);
        setConnectionInfo(getCurrentConnection());
      } else {
        setConnectionError(result.message);
      }
    } catch (error) {
      setConnectionError('Errore di connessione inaspettato');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Sei sicuro di voler disconnetterti? Tutti i dati delle esecuzioni verranno persi.')) {
      disconnect();
      setIsConnected(false);
      setConnectionInfo(null);
      clearExecutions();
      setActiveTab('dashboard');
    }
  };

  const handleExecuteProcedure = (procedure: OracleProcedure) => {
    setSelectedProcedure(procedure);
    setShowExecutionModal(true);
  };

  const handleCloseModal = () => {
    setShowExecutionModal(false);
    setSelectedProcedure(null);
  };

  const handleClearExecutions = () => {
    if (window.confirm('Sei sicuro di voler cancellare tutte le esecuzioni? Questa azione non può essere annullata.')) {
      clearExecutions();
    }
  };

  const handleNavigateFromDashboard = (tab: 'procedures' | 'executions') => {
    setActiveTab(tab);
  };

  // Se non connesso, mostra il form di connessione
  if (!isConnected) {
    return (
      <div>
        <ConnectionForm onConnect={handleConnect} isConnecting={isConnecting} />
        {connectionError && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-md">
            <h4 className="font-medium">Errore di Connessione</h4>
            <p className="text-sm mt-1">{connectionError}</p>
          </div>
        )}
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'procedures', label: 'Procedures', icon: Database },
    { id: 'executions', label: 'Executions', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Oracle Procedure Monitor</h1>
                <p className="text-sm text-gray-600">
                  {connectionInfo?.host}:{connectionInfo?.port} - {connectionInfo?.owner}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleClearExecutions}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Reset tutti i contatori"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleDisconnect}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                title="Disconnetti dal database"
              >
                <LogOut className="h-4 w-4" />
                <span>Disconnetti</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">Monitor your Oracle procedure executions - clicca sui box per navigare</p>
            </div>
            <Dashboard 
              stats={stats} 
              onNavigate={handleNavigateFromDashboard}
            />
            
            {/* Quick Actions Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Azioni Rapide</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('procedures')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
                >
                  <Database className="h-4 w-4" />
                  <span>Visualizza Procedure</span>
                </button>
                
                {stats.activeExecutions > 0 && (
                  <button
                    onClick={() => setActiveTab('executions')}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-600 rounded-lg transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span>{stats.activeExecutions} Esecuzioni Attive</span>
                  </button>
                )}
                
                {stats.totalExecutions > 0 && (
                  <button
                    onClick={() => setActiveTab('executions')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors"
                  >
                    <Activity className="h-4 w-4" />
                    <span>Storico Esecuzioni</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'procedures' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Procedures</h2>
              <p className="text-gray-600">Available Oracle procedures for execution</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProcedures.map((procedure) => (
                <ProcedureCard
                  key={procedure.id}
                  procedure={procedure}
                  onExecute={handleExecuteProcedure}
                  onViewDetails={handleExecuteProcedure}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'executions' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Execution History</h2>
                <p className="text-gray-600">Monitor and track procedure executions</p>
              </div>
              {executions.length > 0 && (
                <button
                  onClick={handleClearExecutions}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Cancella Tutto</span>
                </button>
              )}
            </div>
            
            {executions.length === 0 ? (
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna esecuzione</h3>
                <p className="text-gray-600 mb-4">Esegui una procedura per vedere i risultati qui.</p>
                <button
                  onClick={() => setActiveTab('procedures')}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
                >
                  <Database className="h-4 w-4" />
                  <span>Vai alle Procedure</span>
                </button>
              </div>
            ) : (
              <ExecutionList 
                executions={executions} 
                onViewDetails={(execution) => console.log('View details:', execution)}
              />
            )}
          </div>
        )}
      </main>

      {/* Execution Modal */}
      {showExecutionModal && selectedProcedure && (
        <ExecutionModal
          procedure={selectedProcedure}
          onClose={handleCloseModal}
          onExecute={addExecution}
        />
      )}
    </div>
  );
}

export default App;