// src/app/app.routes.ts
// =====================================================
// Definición de rutas principales del frontend
// =====================================================

import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './infrastructure/security/guards/auth.guard';
import { guestGuard } from './infrastructure/security/guards/guest.guard'; // 👈 evita login si ya hay sesión

export const routes: Routes = [
  // =====================================================
  // 1) Raíz → redirige al login (si no hay sesión activa)
  // =====================================================
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },

  // =====================================================
  // 2) Rutas públicas (solo si el usuario NO tiene sesión)
  //    Se usa guestGuard para que un usuario logueado no
  //    pueda volver a /auth/login o /auth/forgot.
  // =====================================================
  {
    path: 'auth/login',
    canActivate: [guestGuard], // 👈 Si hay sesión → redirige a /home
    loadComponent: () =>
      import('./infrastructure/modules/auth/pages/login/login.component')
        .then(m => m.LoginComponent),
  },
  {
    path: 'auth/forgot',
    canActivate: [guestGuard], // 👈 Igual criterio que login
    loadComponent: () =>
      import('./infrastructure/modules/auth/pages/forgot/forgot.component')
        .then(m => m.ForgotComponent),
  },

  // =====================================================
  // 3) Área autenticada (solo accesible si hay sesión activa)
  //    Protegida con authGuard (valida sesión)
  // =====================================================
  {
    path: '',
    loadComponent: () =>
      import('./infrastructure/layouts/main-layout/main-layout.component')
        .then(m => m.MainLayoutComponent),
    canActivate: [authGuard], // 🔒 exige estar logueado
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./infrastructure/modules/home/pages/home/home.component')
            .then(m => m.HomeComponent),
      },

      // Bandeja → accesible solo a SECRETARIO, JUEZ y ADMIN
      {
        path: 'bandeja',
        canActivate: [roleGuard], // 🔒 además de logueado, pide rol específico
        data: { roles: ['SECRETARIO', 'JUEZ', 'ADMIN'] },
        loadComponent: () =>
          import('./infrastructure/modules/bandeja/pages/bandeja/bandeja.component')
            .then(m => m.BandejaComponent),
      },

      // Generador → accesible solo a JUEZ y ADMIN
      {
        path: 'generador',
        canActivate: [roleGuard],
        data: { roles: ['JUEZ', 'ADMIN'] },
        loadComponent: () =>
          import('./infrastructure/modules/generador/pages/generador/generador.component')
            .then(m => m.GeneradorComponent),
      },

      // =====================================================
      // ✅ Perfil del usuario (CLEAR + SOLID, sin tokens adicionales)
      // - UI = Adaptadores primarios (componentes standalone)
      // - No requiere roleGuard (solo sesión)
      // =====================================================
      {
        path: 'perfil',
        children: [
          {
            path: 'editar',
            loadComponent: () =>
              import('./infrastructure/modules/profile/pages/editt/profile-edit.component')
                .then(m => m.ProfileEditComponent),
          },
          {
            path: 'password',
            loadComponent: () =>
              import('./infrastructure/modules/profile/pages/password/password-change.component')
                .then(m => m.PasswordChangeComponent),
          },
          { path: '', pathMatch: 'full', redirectTo: 'editar' }, // default en módulo perfil
        ],
      },

      // =====================================================
      // 🔧 Bloque de Mantenimiento (aún no lo tienes en tu proyecto)
      // Lo dejo comentado para que no genere errores.
      // Cuando tu compañero te pase estos módulos,
      // solo eliminas los comentarios y funcionará.
      // =====================================================
      /*
      {
        path: 'mant-user',
        loadComponent: () =>
          import('./infrastructure/modules/mant.user/mant.user.component')
            .then(m => m.MantUserComponent),
        children: [
          {
            path: 'edit-profile',
            loadComponent: () =>
              import('./infrastructure/modules/edit-profile/edit-profile.component')
                .then(m => m.EditProfileComponent),
          },
          {
            path: 'change-password',
            loadComponent: () =>
              import('./infrastructure/modules/change-password/change-password.component')
                .then(m => m.ChangePasswordComponent),
          },
          { path: '', redirectTo: 'edit-profile', pathMatch: 'full' }, // default hijo
        ],
      },
      */
    ],
  },

  // =====================================================
  // 4) Ruta comodín → Página 404 (NotFound)
  // =====================================================
  {
    path: '**',
    loadComponent: () =>
      import('./infrastructure/shared/pages/not-found/not-found.component')
        .then(m => m.NotFoundComponent),
  },
];
