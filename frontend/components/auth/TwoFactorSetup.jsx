import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../lib/api';
import { ShieldCheck, AlertCircle, Loader2, Copy, Check } from 'lucide-react';

export default function TwoFactorSetup({ onComplete }) {
  const { accessToken } = useAuth();
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [backupCodes, setBackupCodes] = useState([]);
  const [step, setStep] = useState('scan');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    authAPI.setup2FA(accessToken).then((res) => {
      setQrDataUrl(res.qrDataUrl);
      setBackupCodes(res.backupCodes);
    }).catch(() => setError('Error al configurar 2FA'));
  }, [accessToken]);

  useEffect(() => { inputs.current[0]?.focus(); }, [step]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = async () => {
    const joined = code.join('');
    if (joined.length !== 6) { setError('Ingresa los 6 dígitos'); return; }

    setLoading(true);
    setError('');
    try {
      const res = await authAPI.confirm2FA(joined, accessToken);
      if (!res.success) { setError(res.error || 'Código inválido'); return; }
      onComplete?.();
    } catch (err) {
      setError(err.error || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!qrDataUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Configurar 2FA</h2>
            <p className="text-sm text-gray-500 mt-1">
              Escanea el código QR con tu app de autenticación
            </p>
          </div>

          {step === 'scan' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img src={qrDataUrl} alt="QR 2FA" className="w-48 h-48 rounded-lg border" />
              </div>

              {backupCodes.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-yellow-800 mb-2">Códigos de respaldo:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs font-mono text-yellow-700">
                    {backupCodes.map((c, i) => <span key={i}>{c}</span>)}
                  </div>
                  <button
                    onClick={copyBackupCodes}
                    className="mt-2 flex items-center gap-1 text-xs text-yellow-700 hover:text-yellow-900"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copiado' : 'Copiar códigos'}
                  </button>
                </div>
              )}

              <button
                onClick={() => setStep('verify')}
                className="w-full py-2.5 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <p className="text-sm text-gray-500 text-center">
                Ingresa el código de 6 dígitos para confirmar
              </p>

              <div className="flex justify-center gap-2">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  />
                ))}
              </div>

              <button
                onClick={handleConfirm}
                disabled={loading || code.some((d) => !d)}
                className="w-full py-2.5 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Verificando...' : 'Activar 2FA'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
