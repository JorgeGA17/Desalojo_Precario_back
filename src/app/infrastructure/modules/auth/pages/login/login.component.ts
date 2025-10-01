// ======================================================
// LoginComponent (UI / Angular standalone component)
// - Pantalla de login con formulario simple
// - Invoca AuthService para autenticar con backend
// - Maneja errores y redirección tras login
// ======================================================
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// ✅ PrimeNG UI Modules
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

// ✅ Nuestro servicio de autenticación (infraestructura)
import { AuthService } from '../../../../security/auth/auth.service';

@Component({
  standalone: true,
  selector: 'sp-login',
  // 👇 Importamos módulos necesarios para la vista
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // ------------------------------------------------------
  // Inyección de dependencias
  // ------------------------------------------------------
  private router = inject(Router);        // Navegación
  private auth   = inject(AuthService);   // Servicio de login

  // ------------------------------------------------------
  // Estado del formulario
  // ------------------------------------------------------
  user = '';                // Usuario digitado
  pwd = '';                 // Contraseña digitada
  selectedProfile = '';     // Corte seleccionada en dropdown
  error = '';               // Mensaje de error en login
  loading = false;          // Flag de carga (spinner, disable)

  // ------------------------------------------------------
  // Opciones de cortes (mock / demo)
  // 🔹 Futuro: estas deberían venir de BD negocio
  // ------------------------------------------------------
  profiles = [
    { id: 'LIMA NORTE',     label: 'CSJLima Norte' },
    { id: 'SELVA CENTRAL',  label: 'CSJSelva Central' },
    { id: 'HUANUCO',        label: 'CSJHuanuco' },
    { id: 'JUNIN',          label: 'CSJJunin' }
  ];

  // ------------------------------------------------------
  // submit() → llamado al dar click en "Iniciar sesión"
  // ------------------------------------------------------
  submit() {
    this.error = '';
    // Validación rápida en frontend
    if (!this.user.trim() || !this.pwd.trim() || !this.selectedProfile) {
      this.error = 'Usuario, contraseña y corte son obligatorios';
      return;
    }

    this.loading = true;

    // Invocamos al AuthService.login()
    this.auth.login(this.user.trim(), this.pwd.trim(), this.selectedProfile).subscribe({
      next: () => {
        this.loading = false;
        // ✅ Redirige al home tras login exitoso
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.loading = false;
        // Captura error del backend y lo muestra en pantalla
        this.error = err?.error?.detail || err?.message || 'No se pudo iniciar sesión';
      }
    });
  }

  // ------------------------------------------------------
  // goForgot() → redirección a pantalla "olvidé mi clave"
  // ------------------------------------------------------
  goForgot() {
    if (!this.loading) {
      this.router.navigateByUrl('/auth/forgot');
    }
  }
}
