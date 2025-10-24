import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
const EconeuraCockpit = React.lazy(() => import('./EconeuraCockpit'));
const Login = React.lazy(() => import('./components/Login').then(m => ({ default: m.Login })));
import { Login } from './components/Login';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';

function AppContent() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Check token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('econeura_token');
    const savedUser = localStorage.getItem('econeura_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('econeura_token');
    localStorage.removeItem('econeura_user');
    setToken(null);
    setUser(null);
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* App principal - COCKPIT CON LOGIN INTEGRADO */}
          <Route
            path="/"
            element={
              <Suspense fallback={<div>Cargando...</div>}><EconeuraCockpitWithLogin
                token={token}
                user={user}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
              />
            }
          />

          {/* Redirect any unknown route to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

// Wrapper que muestra Login u Cockpit según estado de sesión
function EconeuraCockpitWithLogin({
  token,
  user,
  onLoginSuccess,
  onLogout
}: {
  token: string | null;
  user: any;
  onLoginSuccess: (token: string, user: any) => void;
  onLogout: () => void;
}) {
  // Si NO hay token, mostrar Login
  if (!token) {
    return <Suspense fallback={<div>Cargando...</div>}><Login onLoginSuccess={onLoginSuccess} />;
  }

  // Si hay token, mostrar Cockpit
  return <Suspense fallback={<div>Cargando...</div>}><EconeuraCockpit user={user} onLogout={onLogout} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App;

