import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';

import { GenerarDocumentosUC } from '../../../../../use-cases/generar-documentos.uc';
import { DocumentoGenerado, GenerarDocsResponse } from '../../../../../domain/dto/expediente.dto';

@Component({
  standalone: true,
  selector: 'sp-generador',
  imports: [
    CommonModule, ReactiveFormsModule,
    InputTextModule, ButtonModule, CardModule,
    MessagesModule, MessageModule, TableModule
  ],
  templateUrl: './generador.component.html',
  styleUrls: ['./generador.component.scss'],
  providers: [GenerarDocumentosUC]
})
export class GeneradorComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private uc = inject(GenerarDocumentosUC);

  loading = signal(false);
  errorMsg = signal<string | null>(null);
  result = signal<GenerarDocsResponse | null>(null);

  form = this.fb.group({
    expedienteNumero: ['', [Validators.required, Validators.minLength(8)]]
  });
  get f() { return this.form.controls; }

  procesar() {
    this.errorMsg.set(null);
    this.result.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMsg.set('Ingrese un número de expediente válido');
      return;
    }

    this.loading.set(true);
    const numero = this.f.expedienteNumero.value || '';
    this.uc.run(numero).subscribe({
      next: res => { this.loading.set(false); this.result.set(res); },
      error: err => { this.loading.set(false); this.errorMsg.set(err?.message || 'Ocurrió un error al procesar'); }
    });
  }

  cancelar() {
    this.form.reset();
    this.errorMsg.set(null);
    this.result.set(null);
  }

  irBandeja() { this.router.navigateByUrl('/bandeja'); }

  descargar(doc: DocumentoGenerado) {
    if (doc.url) window.open(doc.url, '_blank');
  }
}

