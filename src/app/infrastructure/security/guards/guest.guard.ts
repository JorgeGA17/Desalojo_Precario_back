// src/app/infrastructure/security/guards/guest.guard.ts
// =====================================================
// Guard: guestGuard
// -----------------------------------------------------
// ➡️ Objetivo:
//   - Evitar que un usuario con sesión activa entre al
//     login (/auth/login) o al "forgot password" (/auth/forgot).
//
// ➡️ Ejemplo de uso en rutas:
//   {
//     path: 'auth/login',
//     canActivate: [guestGuard],   // 👈 se aplica aquí
//     loadComponent: () => import('...').then(m => m.LoginComponent),
//   }
//
// ➡️ Lógica:
//   - Si el usuario YA está logueado (AuthService.isLoggedIn() = true),
//     lo redirige automáticamente a /home.
//   - Si NO está logueado, permite entrar al login o al forgot password.
// =====================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService); // servicio de autenticación
  const router = inject(Router);    // router Angular para redirecciones

  // ✔️ Caso 1: Usuario ya tiene sesión activa → redirige a /home
  if (auth.isLoggedIn()) {
    return router.createUrlTree(['/home']);
  }

  // ✔️ Caso 2: Usuario no tiene sesión → permite acceder al login
  return true;
};