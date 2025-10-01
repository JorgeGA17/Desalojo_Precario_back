// Interceptor HTTP (angular 16+ con HttpInterceptorFn)
// - Adjunta Authorization: Bearer <token> en TODAS las llamadas (excepto login)
// - Deja preparadas (COMENTADAS) las 4 cabeceras de la guía del PJ para activarlas luego.
// - No mete lógica de negocio: solo transporte/headers.

import { HttpInterceptorFn } from '@angular/common/http';

// 👉 Si quieres leer username/rol almacenados por AuthService,
//    los tomamos directo de localStorage para no acoplar el interceptor.
function getLs(k: string): string {
  try { return localStorage.getItem(k) ?? ''; } catch { return ''; }
}

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getLs('token');

  // No toques la petición de login
  const isLogin = /\/sisprecario-api\/authenticate\/login$/i.test(req.url);
  if (isLogin) {
    return next(req);
  }

  // 1) Adjunta Bearer si hay token
  let cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  // 2) ✅ (OPCIONAL) Cabeceras PJ (descomenta cuando el backend las exija)
  // const pjHeaders: Record<string, string> = {
  //   'X-App-Id'   : 'SICDPRE',               // código de aplicativo
  //   'X-User-Id'  : getLs('username'),       // usuario autenticado
  //   'X-Role-Id'  : getLs('rol'),            // rol del token (p.ej. SPREC_SECRETARIO)
  //   'X-Trace-Id' : crypto.randomUUID(),     // correlación/trazabilidad (browser soporta)
  // };
  // cloned = cloned.clone({ setHeaders: pjHeaders });

  return next(cloned);
};
