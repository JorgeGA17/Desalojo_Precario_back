// Guards de navegación
// - authGuard: exige estar logueado (token en storage)
// - roleGuard: exige que el usuario tenga alguno de los roles requeridos por la ruta
//
// Cómo usar en rutas:
// { path: 'bandeja', canActivate: [authGuard, roleGuard], data: { roles: ['CIVIL','ADMIN'] }, ... }

import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';

function getToken(): string | null {
  try { return localStorage.getItem('token'); } catch { return null; }
}
function getUiRoles(): string[] {
  try { return JSON.parse(localStorage.getItem('roles') ?? '[]'); } catch { return []; }
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = getToken();
  if (token) return true;
  router.navigateByUrl('/auth/login');
  return false;
};

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const required: string[] = route.data?.['roles'] ?? [];  // roles que pide la ruta
  if (!required.length) return true;                       // si no se pide rol, dejamos pasar

  const mine = getUiRoles();                               // roles UI del usuario
  const ok = required.some(r => mine.includes(r));
  if (ok) return true;

  // Si no tiene el rol, lo mandamos a Home (o a una página 403 si la creas)
  router.navigateByUrl('/home');
  return false;
};

