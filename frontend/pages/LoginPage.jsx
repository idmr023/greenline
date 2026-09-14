import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../lib/api';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';
import { Lock, Mail, AlertCircle, ArrowLeft } from '../lib/icons';
import OTPVerify from '../components/auth/OTPVerify';
import TwoFactorVerify from '../components/auth/TwoFactorVerify';
import { login_staff_roles as STAFF_ROLES } from '../../src/data_json.jsx';

// Vincula la sesión de Supabase Auth del staff usando la misma credencial del backend.
async function linkSupabase(email, password, accessToken) {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) return;

  let res = await supabase.auth.signInWithPassword({ email, password });
  if (!res.error) return;

  await authAPI.supabaseSync(password, accessToken);
  res = await supabase.auth.signInWithPassword({ email, password });
  if (res.error) {
    throw new Error(res.error.message || 'No se pudo vincular el acceso de datos');
  }
}

export default function LoginPage() {
  const { saveSession } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [loginResult, setLoginResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authAPI.login(email, password);

      if (!res.success) {
        setError(res.error || 'Credenciales inválidas');
        setLoading(false);
        return;
      }

      // El staff pasa por la puerta de acceso (verificada en el servidor).
      if (res.requiresStaffGate) {
        setLoginResult(res);
        setStep('temp');
        setLoading(false);
        return;
      }

      if (res.requiresOTP) {
        setLoginResult(res);
        setStep('otp');
      } else if (res.requires2FA) {
        setLoginResult(res);
        setStep('2fa');
      } else {
        saveSession({ accessToken: res.accessToken, refreshToken: res.refreshToken }, res.user);
        if (res.user.rol !== 'CLIENTE') {
          try {
            await linkSupabase(email, password, res.accessToken);
          } catch {
            // El panel pedirá la vinculación si hace falta
          }
        }
        navigate(res.user.rol === 'CLIENTE' ? '/' : '/admin');
      }
    } catch (err) {
      setError(err.error || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleTempVerified = async (e) => {
    e.preventDefault();
    if (!tempPassword) {
      setError('Ingresa el código de acceso');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await authAPI.verifyGate(loginResult.tempToken, tempPassword);

      if (!res.success) {
        setError(res.error || 'Código de acceso incorrecto');
        setLoading(false);
        return;
      }

      // Staff con 2FA: avanzar al siguiente factor
      if (res.requires2FA) {
        setLoginResult({ ...loginResult, tempToken: res.tempToken });
        setStep('2fa');
        setLoading(false);
        return;
      }

      saveSession({ accessToken: res.accessToken, refreshToken: res.refreshToken }, res.user);
      if (res.user.rol !== 'CLIENTE') {
        try {
          await linkSupabase(email, password, res.accessToken);
        } catch {
          // El panel pedirá la vinculación si hace falta
        }
      }
      navigate('/admin');
    } catch (err) {
      setError(err.error || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = (tokens, user) => {
    saveSession(tokens, user);
    navigate('/');
  };

  const handle2FAVerified = async (tokens, user) => {
    saveSession(tokens, user);
    try {
      await linkSupabase(email, password, tokens.accessToken);
    } catch {
      // El panel pedirá la vinculación si hace falta
    }
    navigate('/admin');
  };

  if (step === 'temp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Verificación temporal</h1>
              <p className="text-sm text-gray-500 mt-1">Ingresa la contraseña de acceso temporal</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleTempVerified} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña temporal</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    autoFocus
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
              >
                Continuar
              </button>
            </form>

            <button
              type="button"
              onClick={() => { setStep('credentials'); setLoginResult(null); setTempPassword(''); setError(''); }}
              className="mt-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <OTPVerify
        email={email}
        onVerified={handleOTPVerified}
        onBack={() => { setStep('credentials'); setLoginResult(null); setError(''); }}
      />
    );
  }

  if (step === '2fa') {
    return (
      <TwoFactorVerify
        tempToken={loginResult.tempToken}
        onVerified={handle2FAVerified}
        onBack={() => { setStep('credentials'); setLoginResult(null); setError(''); }}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <SEOHead title="Iniciar Sesión" description="Accede al panel de administración de Green Line." url="/login" />
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">GreenLine</h1>
            <p className="text-sm text-gray-500 mt-1">Inicia sesión en tu cuenta</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Staff: se verificará con código QR · Clientes: recibirás un código por email
        </p>
      </div>
    </div>
  );
}
