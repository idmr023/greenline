import { Navigate, useLocation } from 'react-router-dom';
import { resolveLegacyPath } from '../lib/legacyRedirects';

export default function LegacyRedirect() {
  const { pathname, search } = useLocation();
  const target = resolveLegacyPath(pathname, search);
  if (!target) return null;
  return <Navigate to={target} replace />;
}