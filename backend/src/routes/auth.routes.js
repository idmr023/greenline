import { Router } from 'express';
import { z } from 'zod';
import { login, verifyStaffGate, verifyOTP, verify2FALogin, setup2FA, confirm2FA, refreshTokens, logout, requestPasswordReset, resetPassword } from '../services/auth.service.js';
import { syncSupabaseAuthUser } from '../services/supabase-admin.service.js';
import { listPanelRoles, setPanelRole } from '../services/panel.service.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { loginLimiter, otpLimiter, gateLimiter, twoFALimiter, refreshLimiter, resetRequestLimiter, resetConfirmLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Contraseña requerida'),
  }),
});

const gateSchema = z.object({
  body: z.object({
    tempToken: z.string(),
    gate: z.string().min(1, 'Código de acceso requerido'),
  }),
});

const otpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    codigo: z.string().length(6, 'El código debe tener 6 dígitos'),
  }),
});

const verify2FASchema = z.object({
  body: z.object({
    tempToken: z.string(),
    totpCode: z.string().length(6),
  }),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

const resetRequestSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
  }),
});

const resetConfirmSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    codigo: z.string().length(6, 'El código debe tener 6 dígitos'),
    newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  }),
});

const supabaseSyncSchema = z.object({
  body: z.object({
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
});

const panelGrantSchema = z.object({
  body: z.object({
    rol: z.enum(['ADMIN', 'EDITORA_BLOG', 'DISTRIBUCION', 'GERENTE_TIENDA',
      'COLABORADOR_TIENDA', 'GERENTE_ALMACEN', 'COLABORADOR_ALMACEN', 'DESARROLLADOR_WEB']),
    activo: z.boolean(),
  }),
});

// POST /auth/login — Login unificado (staff + clientes)
router.post('/login', loginLimiter, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password, req.ip, req.headers['user-agent']);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /auth/verify-otp — Verificar OTP (clientes)
router.post('/verify-otp', otpLimiter, validate(otpSchema), async (req, res) => {
  try {
    const { email, codigo } = req.body;
    const result = await verifyOTP(email, codigo, req.ip, req.headers['user-agent']);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error verificando OTP:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /auth/verify-gate — Verificar puerta de acceso staff
router.post('/verify-gate', gateLimiter, validate(gateSchema), async (req, res) => {
  try {
    const { tempToken, gate } = req.body;
    const result = await verifyStaffGate(tempToken, gate, req.ip, req.headers['user-agent']);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error verificando puerta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /auth/verify-2fa — Verificar 2FA TOTP (staff)
router.post('/verify-2fa', twoFALimiter, validate(verify2FASchema), async (req, res) => {
  try {
    const { tempToken, totpCode } = req.body;
    const result = await verify2FALogin(tempToken, totpCode, req.ip, req.headers['user-agent']);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error verificando 2FA:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /auth/setup-2fa — Configurar 2FA (staff, requiere auth)
router.post('/setup-2fa', authMiddleware, async (req, res) => {
  try {
    if (req.user.rol === 'CLIENTE') {
      return res.status(400).json({ error: 'Los clientes no necesitan 2FA' });
    }
    const result = await setup2FA(req.user.id);
    res.json(result);
  } catch (error) {
    console.error('Error configurando 2FA:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /auth/confirm-2fa — Confirmar y activar 2FA
router.post('/confirm-2fa', authMiddleware, async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token requerido' });

    const result = await confirm2FA(req.user.id, token);
    res.json(result);
  } catch (error) {
    console.error('Error confirmando 2FA:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /auth/refresh — Renovar tokens
router.post('/refresh', refreshLimiter, validate(refreshSchema), async (req, res) => {
  try {
    const result = await refreshTokens(req.body.refreshToken, req.ip, req.headers['user-agent']);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error refrescando tokens:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /auth/request-reset — Solicitar restablecimiento de contraseña
router.post('/request-reset', resetRequestLimiter, validate(resetRequestSchema), async (req, res) => {
  try {
    const result = await requestPasswordReset(req.body.email, req.ip);
    res.json(result);
  } catch (error) {
    console.error('Error solicitando restablecimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /auth/reset-password — Confirmar restablecimiento con el OTP recibido
router.post('/reset-password', resetConfirmLimiter, validate(resetConfirmSchema), async (req, res) => {
  try {
    const { email, codigo, newPassword } = req.body;
    const result = await resetPassword(email, codigo, newPassword, req.ip);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error restableciendo contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /auth/logout — Cerrar sesión
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    await logout(req.user.id, refreshToken);
    res.json({ success: true });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /auth/supabase-sync — Vincular el supabase.auth del staff autenticado
// Crea o actualiza su cuenta en Supabase Auth con la misma credencial del backend.
router.post('/supabase-sync', authMiddleware, validate(supabaseSyncSchema), async (req, res) => {
  try {
    if (req.user.rol === 'CLIENTE') {
      return res.status(403).json({ error: 'Los clientes no requieren acceso Supabase' });
    }

    const result = await syncSupabaseAuthUser({
      email: req.user.email,
      password: req.body.password,
    });

    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error sincronizando Supabase Auth:', error);
    res.status(500).json({ error: 'No se pudo vincular el acceso de datos' });
  }
});

// GET /auth/panel-grants — Roles con acceso de escritura al panel (solo ADMIN / DESARROLLADOR_WEB)
router.get('/panel-grants', authMiddleware, requirePermission('panel:acceso'), async (req, res) => {
  try {
    const roles = await listPanelRoles();
    res.json({ roles });
  } catch (error) {
    console.error('Error listando accesos al panel:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// POST /auth/panel-grants — Conceder/revocar acceso al panel por rol
router.post('/panel-grants', authMiddleware, requirePermission('panel:acceso'), validate(panelGrantSchema), async (req, res) => {
  try {
    await setPanelRole({ rol: req.body.rol, activo: req.body.activo, userId: req.user.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error actualizando accesos al panel:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// GET /auth/me — Obtener usuario actual
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;
