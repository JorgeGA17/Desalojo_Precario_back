// =========================================
// ADAPTADOR PRIMARIO (UI Component)
// - Formulario reactivo para cambiar contraseña
// - Compone manualmente Repo + UseCase
// - Invoca PUERTOS DE ENTRADA
// - No sabe cómo se guardan los datos
// =========================================
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// =========================================
// PUERTO DE ENTRADA (UseCase)
// - Los Casos de Uso dependen de esta abstracción (DIP - SOLID)
// =========================================
import { ChangeMyPasswordUseCase } from '../../../../../use-cases/change-my-password.uc';

// =========================================
// ADAPTADOR SECUNDARIO (HTTP Repository)
// - Implementa PUERTO DE SALIDA (ProfileRepositoryPort)
// =========================================
import { ProfileHttpRepository } from '../../../../repositories/http/profile.http.repo';

// =========================================
// PrimeNG UI Components
// =========================================
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss'],
})
export class PasswordChangeComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private msg = inject(MessageService);

  // =========================================
  // Wiring manual (UI ensambla dependencias)
  // =========================================
  private repo = new ProfileHttpRepository(this.http);
  private changeUC = new ChangeMyPasswordUseCase(this.repo); 
  // - Los Casos de Uso dependen de esta abstracción (DIP - SOLID)

  // =========================================
  // Reactive Form con validadores
  // =========================================
  form = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', [Validators.required]],
    },
    { validators: [this.passwordsMatchValidator] }
  );

  // Helper para mostrar errores en el template
  showError = (ctrl: 'currentPassword' | 'newPassword' | 'confirm') =>
    !!this.form.get(ctrl)?.invalid && !!this.form.get(ctrl)?.touched;

  // Estado reactivo (signals)
  submitting = signal<boolean>(false);
  disabled = computed(() => this.submitting() || this.form.invalid);

  // =========================================
  // Validador custom: coincidencia de contraseñas
  // =========================================
  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pwd = group.get('newPassword')?.value;
    const conf = group.get('confirm')?.value;
    return pwd && conf && pwd !== conf ? { passwordMismatch: true } : null;
  }

  // =========================================
  // Acción principal: actualizar contraseña
  // =========================================
  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = {
      currentPassword: this.form.get('currentPassword')!.value!,
      newPassword: this.form.get('newPassword')!.value!,
    };

    try {
      this.submitting.set(true);
      await this.changeUC.execute(dto);
      this.msg.add({
        severity: 'success',
        summary: 'Seguridad',
        detail: 'Contraseña actualizada',
      });
      this.form.reset();
    } catch {
      this.msg.add({
        severity: 'error',
        summary: 'Seguridad',
        detail: 'No se pudo actualizar la contraseña',
      });
    } finally {
      this.submitting.set(false);
    }
  }
}
