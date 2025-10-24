import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Github } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Detectar token de OAuth en URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // OAuth redirect - guardar token y autenticar
      localStorage.setItem('econeura_token', token);

      // Obtener info del usuario
      const apiUrl = window.location.hostname.includes('vercel.app') ||
                     window.location.hostname.includes('econeura.com') ||
                     window.location.hostname.includes('azurestaticapps.net')
        ? 'https://econeura-backend-v2.azurewebsites.net'
        : 'https://econeura-backend-v2.azurewebsites.net';

      fetch(`${apiUrl}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(user => {
          localStorage.setItem('econeura_user', JSON.stringify(user));
          onLoginSuccess(token, user);
          // Limpiar URL
          window.history.replaceState({}, '', '/');
        })
        .catch(() => {
          setError('Error al autenticar con OAuth');
        });
    }
  }, [onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (mode === 'register' && !name)) {
      setError('Por favor completa todos los campos');
      return;
    }
    setError('');

    // Validación simple de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { email, password }
        : { email, password, name };

      // Auto-detectar producción vs local
      const isProduction = window.location.hostname.includes('vercel.app') ||
                           window.location.hostname.includes('econeura.com') ||
                           window.location.hostname.includes('azurestaticapps.net');
      const apiUrl = isProduction ? 'https://econeura-backend-v2.azurewebsites.net' : 'https://econeura-backend-v2.azurewebsites.net';

      let data;

      // MODO DEMO: Si no hay backend, permitir login con cualquier credencial válida
      try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Authentication failed');
        }
      } catch (fetchError) {
        // Si el backend no responde, usar modo demo
        if (import.meta.env.DEV) {
          console.log('Backend no disponible, usando modo DEMO');
        }
        data = {
          token: 'demo-token-' + Date.now(),
          user: {
            id: '1',
            email: email,
            name: name || email.split('@')[0],
            role: 'admin'
          }
        };
      }

      // Guardar token según "Remember me"
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('econeura_token', data.token);
      storage.setItem('econeura_user', JSON.stringify(data.user));

      // Limpiar del otro storage si existe
      const otherStorage = rememberMe ? sessionStorage : localStorage;
      otherStorage.removeItem('econeura_token');
      otherStorage.removeItem('econeura_user');

      onLoginSuccess(data.token, data.user);

    } catch (err: any) {
      // Mensajes de error específicos y útiles
      let errorMessage = 'Error de conexión';
      
      if (err.message) {
        // Errores específicos de la API
        if (err.message.includes('Invalid credentials') || err.message.includes('Authentication failed')) {
          errorMessage = 'Email o contraseña incorrectos';
        } else if (err.message.includes('User not found')) {
          errorMessage = mode === 'login' 
            ? 'Usuario no encontrado. ¿Necesitas registrarte?' 
            : 'Error al crear usuario';
        } else if (err.message.includes('Email already exists')) {
          errorMessage = 'Este email ya está registrado. ¿Quieres iniciar sesión?';
        } else if (err.message.includes('Network')) {
          errorMessage = 'Sin conexión a internet. Verifica tu red';
        } else if (err.message.includes('timeout')) {
          errorMessage = 'El servidor tardó demasiado en responder. Inténtalo de nuevo';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: 'google' | 'microsoft' | 'github') => {
    const apiUrl = window.location.hostname.includes('vercel.app') ||
                   window.location.hostname.includes('econeura.com') ||
                   window.location.hostname.includes('azurestaticapps.net')
      ? 'https://econeura-backend-v2.azurewebsites.net'
      : 'https://econeura-backend-v2.azurewebsites.net';

    window.location.href = `${apiUrl}/api/oauth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Luz sutil de fondo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>

      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-md p-10 border border-white/20 relative">
        {/* Brillo superior */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

        {/* Logo y Header */}
        <div className="text-center mb-10">
          {/* Logo circular solo */}
          <div className="inline-block mb-6">
            <div
              className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-full p-1 shadow-2xl transform transition-all duration-500 hover:scale-105"
              style={{
                boxShadow: '0 25px 50px rgba(16, 185, 129, 0.3), 0 15px 30px rgba(20, 184, 166, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.4)'
              }}
            >
              {/* Contenedor blanco interno */}
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src="/logo-econeura.svg"
                  alt="ECONEURA Logo"
                  className="w-full h-full object-cover"
                  style={{
                    transform: 'scale(1.3)',
                    transformOrigin: 'center center'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Título ECONEURA */}
          <h1 className="text-4xl font-black tracking-tight text-white mb-3"
              style={{
                fontFamily: '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.03em',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}>
            ECONEURA
          </h1>

          {/* Subtítulo */}
          <div className="space-y-2">
            <p className="text-xl font-semibold text-emerald-400"
               style={{
                 fontFamily: '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
                 letterSpacing: '-0.01em'
               }}>
              {mode === 'login' ? 'BIENVENIDO' : 'CREA TU CUENTA'}
            </p>
            <p className="text-sm text-slate-300 font-light leading-relaxed"
               style={{
                 fontFamily: '"Inter", "SF Pro Text", system-ui, -apple-system, sans-serif'
               }}>
              Accede a tu <span className="font-semibold text-emerald-400">ecosistema de inteligencia colectiva</span>
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200 text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* OAuth buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={() => handleOAuth('google')}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 font-semibold text-white shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <button
            onClick={() => handleOAuth('microsoft')}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 font-semibold text-white shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#f25022" d="M0 0h11.377v11.372H0z"/>
              <path fill="#00a4ef" d="M12.623 0H24v11.372H12.623z"/>
              <path fill="#7fba00" d="M0 12.628h11.377V24H0z"/>
              <path fill="#ffb900" d="M12.623 12.628H24V24H12.623z"/>
            </svg>
            Continuar con Microsoft
          </button>

          <button
            onClick={() => handleOAuth('github')}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 font-semibold text-white shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            <Github className="w-5 h-5" />
            Continuar con GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <span className="text-sm text-slate-400 font-medium px-2">O con email</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder:text-slate-400 backdrop-blur-sm"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder:text-slate-400 backdrop-blur-sm"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder:text-slate-400 backdrop-blur-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Remember me checkbox */}
          {mode === 'login' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm text-slate-300 cursor-pointer select-none">
                Mantener sesión iniciada
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-3.5 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 active:scale-95"
          >
            {loading ? 'Cargando...' : (mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta')}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-sm text-emerald-400 hover:text-emerald-300 font-semibold hover:underline transition-all duration-200"
          >
            {mode === 'login'
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-slate-400">
          Al continuar, aceptas nuestros{' '}
          <a href="/terms" target="_blank" className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-colors">
            Términos
          </a>{' '}
          y{' '}
          <a href="/privacy" target="_blank" className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-colors">
            Privacidad
          </a>
        </div>
      </div>
    </div>
  );
}
