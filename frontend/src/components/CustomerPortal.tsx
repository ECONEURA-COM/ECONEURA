import React, { useState, useEffect } from 'react';
import { X, User, CreditCard, Settings, Download, Shield, AlertCircle } from 'lucide-react';

interface CustomerPortalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  darkMode?: boolean;
}

interface UserProfile {
  email: string;
  name: string;
  plan: string;
  usage: {
    executions: number;
    tokens: number;
    limit: number;
  };
}

export function CustomerPortal({ isOpen, onClose, token, darkMode = false }: CustomerPortalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'security'>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    setLoading(true);
    // Mock data (en producción vendría de API)
    setTimeout(() => {
      setProfile({
        email: 'usuario@empresa.com',
        name: 'Usuario Demo',
        plan: 'Premium',
        usage: {
          executions: 1247,
          tokens: 45678,
          limit: 100000
        }
      });
      setLoading(false);
    }, 500);
  };

  const handleExportData = async () => {
    try {
      const isProduction = window.location.hostname.includes('vercel.app') ||
                           window.location.hostname.includes('econeura.com') ||
                           window.location.hostname.includes('azurestaticapps.net');
      const apiUrl = isProduction ? 'https://econeura-backend-v2.azurewebsites.net' : 'https://econeura-backend-v2.azurewebsites.net';

      const response = await fetch(`${apiUrl}/api/gdpr/export-data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to export data');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `econeura-data-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile' as const, label: 'Perfil', icon: User },
    { id: 'billing' as const, label: 'Facturación', icon: CreditCard },
    { id: 'security' as const, label: 'Seguridad', icon: Shield }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className={`rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col ${
        darkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Settings className="w-7 h-7 text-blue-600" />
            Portal del Cliente
          </h2>
          <button 
            onClick={onClose}
            className={`transition-colors ${
              darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? darkMode
                      ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                      : 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                    : darkMode
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Cargando...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'profile' && profile && (
                <div className="space-y-6">
                  <div className={`p-6 rounded-xl border ${
                    darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h3 className="text-lg font-bold mb-4">Información Personal</h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Nombre
                        </label>
                        <p className="text-lg font-semibold">{profile.name}</p>
                      </div>
                      <div>
                        <label className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Email
                        </label>
                        <p className="text-lg font-semibold">{profile.email}</p>
                      </div>
                      <div>
                        <label className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Plan
                        </label>
                        <p className="text-lg font-semibold text-blue-600">{profile.plan}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl border ${
                    darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h3 className="text-lg font-bold mb-4">Uso del Servicio</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Tokens usados
                          </span>
                          <span className="font-semibold">
                            {profile.usage.tokens.toLocaleString()} / {profile.usage.limit.toLocaleString()}
                          </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${
                          darkMode ? 'bg-slate-600' : 'bg-slate-200'
                        }`}>
                          <div 
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${(profile.usage.tokens / profile.usage.limit) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Ejecuciones este mes
                        </span>
                        <p className="text-2xl font-bold">{profile.usage.executions.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleExportData}
                    className={`w-full px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      darkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Download className="w-5 h-5" />
                    Exportar Mis Datos (GDPR)
                  </button>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div className={`p-6 rounded-xl border ${
                    darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h3 className="text-lg font-bold mb-4">Plan Actual</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">Premium</p>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          €49/mes • Facturación mensual
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Cambiar Plan
                      </button>
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl border ${
                    darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h3 className="text-lg font-bold mb-4">Historial de Facturas</h3>
                    <div className="space-y-3">
                      {['Enero 2025', 'Diciembre 2024', 'Noviembre 2024'].map((mes, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2">
                          <span>{mes} - €49.00</span>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Descargar PDF
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className={`p-6 rounded-xl border ${
                    darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h3 className="text-lg font-bold mb-4">Autenticación de Dos Factores</h3>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                      <div className="flex-1">
                        <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                          2FA no está activado. Protege tu cuenta habilitando la autenticación de dos factores.
                        </p>
                        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Activar 2FA
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl border ${
                    darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h3 className="text-lg font-bold mb-4">Sesiones Activas</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">Windows PC (Actual)</p>
                          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Madrid, España • Última actividad: hace 2 min
                          </p>
                        </div>
                        <span className="text-green-600 text-sm font-medium">Actual</span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl border border-red-500/50 ${
                    darkMode ? 'bg-red-900/20' : 'bg-red-50'
                  }`}>
                    <h3 className="text-lg font-bold mb-2 text-red-600">Zona de Peligro</h3>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Las acciones en esta sección son permanentes y no se pueden deshacer.
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Eliminar Mi Cuenta
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

