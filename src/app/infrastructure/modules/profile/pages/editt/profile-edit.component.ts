// =========================================
// ADAPTADOR PRIMARIO (UI Component)
// - Formulario reactivo para editar perfil
// - Compone manualmente Repo + UseCases
// - Invoca PUERTOS DE ENTRADA
// - No sabe cómo se guardan/traen los datos
// =========================================
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// =========================================
// PUERTOS DE ENTRADA (UseCases)
// - Los Casos de Uso dependen de esta abstracción (DIP - SOLID)
// =========================================
import { GetMyProfileUseCase } from '../../../../../use-cases/get-my-profile.uc';
import { UpdateMyProfileUseCase } from '../../../../../use-cases/update-my-profile.uc';

// =========================================
// ADAPTADOR SECUNDARIO (HTTP Repository)
// - Implementa PUERTO DE SALIDA (ProfileRepositoryPort)
// =========================================
import { ProfileHttpRepository } from '../../../../repositories/http/profile.http.repo';

// =========================================
// PrimeNG UI Components
// =========================================
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    SkeletonModule, // 👈 skeletons de carga
  ],
  providers: [MessageService],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private msg = inject(MessageService);

  // =========================================
  // Wiring manual (UI ensambla dependencias)
  // =========================================
  private repo = new ProfileHttpRepository(this.http);
  private getUC = new GetMyProfileUseCase(this.repo);       // - Los Casos de Uso dependen de esta abstracción (DIP - SOLID)
  private updateUC = new UpdateMyProfileUseCase(this.repo); // - Los Casos de Uso dependen de esta abstracción (DIP - SOLID)

  // =========================================
  // Estado reactivo (signals)
  // =========================================
  loading = signal<boolean>(true);
  loadError = signal<string | null>(null);

  form = this.fb.group({
    username: [{ value: '', disabled: true }],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  showError = (ctrl: keyof typeof this.form.controls) =>
    !!this.form.get(ctrl)?.invalid && !!this.form.get(ctrl)?.touched;

  saving = signal<boolean>(false);
  saveDisabled = computed(() => this.saving() || this.form.invalid || this.form.pristine);

  // =========================================
  // Ciclo de vida
  // =========================================
  async ngOnInit() {
    try {
      this.loading.set(true);
      const me = await this.getUC.execute();
      this.form.patchValue({
        username: me.username,
        firstName: me.firstName,
        lastName: me.lastName,
        email: me.email,
      });
      this.loadError.set(null);
    } catch {
      this.loadError.set('No se pudo cargar el perfil.');
    } finally {
      this.loading.set(false);
    }
  }

  // =========================================
  // Acción principal: guardar perfil
  // =========================================
  async onSaveProfile() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = {
      fullName: `${this.form.get('firstName')!.value!} ${this.form.get('lastName')!.value!}`,
      email: this.form.get('email')!.value!,
    };

    try {
      this.saving.set(true);
      await this.updateUC.execute(dto);
      this.msg.add({ severity: 'success', summary: 'Perfil', detail: 'Perfil actualizado' });
      this.form.markAsPristine();
    } catch {
      this.msg.add({ severity: 'error', summary: 'Perfil', detail: 'No se pudo guardar' });
    } finally {
      this.saving.set(false);
    }
  }

  // =========================================
  // Acción secundaria: restaurar valores originales
  // =========================================
  onCancel() {
    this.form.reset(this.form.getRawValue());
  }
}
