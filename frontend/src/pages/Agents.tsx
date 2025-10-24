/**
 * ECONEURA Agents Page
 * Gestión completa de agentes automatizados conectados por usuarios
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  PlayIcon, 
  PauseIcon, 
  TrashIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Agent {
  id: string;
  name: string;
  description?: string;
  platform: 'make' | 'n8n' | 'zapier' | 'powerautomate' | 'econeura' | 'custom';
  department: string;
  neura_assigned: string;
  status: 'active' | 'paused' | 'error';
  schedule: string;
  last_execution?: string;
  last_result?: any;
  execution_count: number;
  success_count: number;
  error_count: number;
  created_at: string;
}

interface AgentsPageProps {
  onNavigate: (page: string) => void;
}

const AgentsPage: React.FC<AgentsPageProps> = ({ onNavigate }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConnectWizard, setShowConnectWizard] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showAgentDetails, setShowAgentDetails] = useState(false);
  const [executingAgents, setExecutingAgents] = useState<Set<string>>(new Set());

  // Filtros
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const [filterPlatform, setFilterPlatform] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Cargar agentes al montar componente
  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const params = new URLSearchParams();
      if (filterDepartment) params.append('department', filterDepartment);
      if (filterPlatform) params.append('platform', filterPlatform);
      if (filterStatus) params.append('status', filterStatus);

      const response = await fetch(`/api/agents?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setAgents(data.agents || []);

    } catch (err) {
      console.error('Error loading agents:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar agente
  const executeAgent = async (agentId: string) => {
    try {
      setExecutingAgents(prev => new Set(prev).add(agentId));

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`/api/agents/${agentId}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          params: {},
          triggered_by: 'user'
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Agent execution started:', data);

      // Recargar agentes después de un breve delay
      setTimeout(() => {
        loadAgents();
      }, 2000);

    } catch (err) {
      console.error('Error executing agent:', err);
      setError(err instanceof Error ? err.message : 'Error ejecutando agente');
    } finally {
      setExecutingAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agentId);
        return newSet;
      });
    }
  };

  // Eliminar agente
  const deleteAgent = async (agentId: string, agentName: string) => {
    if (!confirm(`¿Estás seguro de eliminar el agente "${agentName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Recargar lista de agentes
      loadAgents();

    } catch (err) {
      console.error('Error deleting agent:', err);
      setError(err instanceof Error ? err.message : 'Error eliminando agente');
    }
  };

  // Obtener icono de plataforma
  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      make: '🔧',
      n8n: '⚡',
      zapier: '⚡',
      powerautomate: '🔵',
      econeura: '🧠',
      custom: '⚙️'
    };
    return icons[platform] || '❓';
  };

  // Obtener color de estado
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'text-green-600 bg-green-100',
      paused: 'text-yellow-600 bg-yellow-100',
      error: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  // Obtener icono de estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'paused':
        return <PauseIcon className="w-4 h-4" />;
      case 'error':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ExclamationTriangleIcon className="w-4 h-4" />;
    }
  };

  // Calcular éxito rate
  const getSuccessRate = (agent: Agent) => {
    if (agent.execution_count === 0) return 0;
    return Math.round((agent.success_count / agent.execution_count) * 100);
  };

  // Departamentos únicos para filtro
  const departments = Array.from(new Set(agents.map(a => a.department))).sort();
  const platforms = Array.from(new Set(agents.map(a => a.platform))).sort();
  const statuses = Array.from(new Set(agents.map(a => a.status))).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agentes Automatizados</h1>
          <p className="text-gray-600">Gestiona tus automatizaciones conectadas</p>
        </div>
        <button
          onClick={() => setShowConnectWizard(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Conectar Agente</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <XCircleIcon className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plataforma
            </label>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={loadAgents}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{agents.length}</div>
          <div className="text-sm text-gray-600">Total Agentes</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {agents.filter(a => a.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Activos</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {agents.filter(a => a.status === 'paused').length}
          </div>
          <div className="text-sm text-gray-600">Pausados</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-600">
            {agents.filter(a => a.status === 'error').length}
          </div>
          <div className="text-sm text-gray-600">Con Error</div>
        </div>
      </div>

      {/* Lista de Agentes */}
      <div className="bg-white rounded-lg border border-gray-200">
        {agents.length === 0 ? (
          <div className="text-center py-12">
            <AdjustmentsHorizontalIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay agentes conectados</h3>
            <p className="text-gray-600 mb-4">
              Conecta tu primer agente automatizado para comenzar
            </p>
            <button
              onClick={() => setShowConnectWizard(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Conectar Primer Agente
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {agents.map((agent) => (
              <div key={agent.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getPlatformIcon(agent.platform)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                      {agent.description && (
                        <p className="text-sm text-gray-600">{agent.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">{agent.department}</span>
                        <span className="text-xs text-gray-500">NEURA-{agent.neura_assigned}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                          {getStatusIcon(agent.status)}
                          <span className="ml-1">{agent.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Stats */}
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {getSuccessRate(agent)}% éxito
                      </div>
                      <div className="text-xs text-gray-500">
                        {agent.execution_count} ejecuciones
                      </div>
                    </div>

                    {/* Última ejecución */}
                    {agent.last_execution && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Última ejecución</div>
                        <div className="text-sm text-gray-900">
                          {new Date(agent.last_execution).toLocaleDateString()}
                        </div>
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAgent(agent);
                          setShowAgentDetails(true);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Ver detalles"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>

                      {agent.status === 'active' && (
                        <button
                          onClick={() => executeAgent(agent.id)}
                          disabled={executingAgents.has(agent.id)}
                          className="p-2 text-green-600 hover:text-green-700 disabled:opacity-50 transition-colors"
                          title="Ejecutar agente"
                        >
                          {executingAgents.has(agent.id) ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                          ) : (
                            <PlayIcon className="w-5 h-5" />
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => deleteAgent(agent.id, agent.name)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        title="Eliminar agente"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connect Agent Wizard Modal */}
      {showConnectWizard && (
        <ConnectAgentWizard
          onClose={() => setShowConnectWizard(false)}
          onSuccess={() => {
            setShowConnectWizard(false);
            loadAgents();
          }}
        />
      )}

      {/* Agent Details Modal */}
      {showAgentDetails && selectedAgent && (
        <AgentDetailsModal
          agent={selectedAgent}
          onClose={() => {
            setShowAgentDetails(false);
            setSelectedAgent(null);
          }}
        />
      )}
    </motion.div>
  );
};

// Componente Wizard para conectar agentes (placeholder)
const ConnectAgentWizard: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Conectar Nuevo Agente</h2>
        <p className="text-gray-600 mb-4">
          Esta funcionalidad se implementará en la siguiente fase.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onSuccess}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Simular Éxito
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Modal para detalles de agente (placeholder)
const AgentDetailsModal: React.FC<{
  agent: Agent;
  onClose: () => void;
}> = ({ agent, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Detalles del Agente: {agent.name}</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Plataforma</label>
              <p className="text-gray-900">{agent.platform}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Departamento</label>
              <p className="text-gray-900">{agent.department}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">NEURA Asignado</label>
              <p className="text-gray-900">{agent.neura_assigned}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <p className="text-gray-900">{agent.status}</p>
            </div>
          </div>
          {agent.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <p className="text-gray-900">{agent.description}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;

