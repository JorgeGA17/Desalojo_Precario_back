import { Injectable, inject } from '@angular/core';
import { Observable, throwError, of, switchMap } from 'rxjs';
import { GenerarDocsResponse } from '../domain/dto/expediente.dto';
import { ExpedienteService } from '../infrastructure/services/remoto/expediente.service';

@Injectable()
export class GenerarDocumentosUC {
  private svc = inject(ExpedienteService);

  run(expedienteNumero: string): Observable<GenerarDocsResponse> {
    const numero = (expedienteNumero ?? '').trim();

    if (!numero)       return throwError(() => new Error('El número de expediente es obligatorio'));
    if (numero.length < 8) return throwError(() => new Error('Número de expediente inválido'));

    return of(numero).pipe(
      switchMap(n => this.svc.generarDocumentos({ expedienteNumero: n }))
    );
  }
}
