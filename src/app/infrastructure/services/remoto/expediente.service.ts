import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GenerarDocsRequest, GenerarDocsResponse, BandejaQuery, BandejaResponse} from '../../../domain/dto/expediente.dto';

@Injectable({ providedIn: 'root' })
export class ExpedienteService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/civil/expedientes`;

  generarDocumentos(payload: GenerarDocsRequest): Observable<GenerarDocsResponse> {
    return this.http.post<GenerarDocsResponse>(`${this.baseUrl}/generar-documentos`, payload).pipe(
      catchError(err => throwError(() => new Error(err?.error?.message ?? 'No se pudo generar los documentos')))
    );
  }

  listarBandeja(q: BandejaQuery): Observable<BandejaResponse> {
    let params = new HttpParams()
      .set('page', q.page)
      .set('size', q.size);
    if (q.search) params = params.set('search', q.search);
    if (q.estado && q.estado !== 'TODOS') params = params.set('estado', q.estado);

    return this.http.get<BandejaResponse>(`${this.baseUrl}/bandeja`, { params }).pipe(
      catchError(err => throwError(() => new Error(err?.error?.message ?? 'No se pudo cargar la bandeja')))
    );
  }

  reintentar(id: string) {
    return this.http.post<void>(`${this.baseUrl}/documentos/${id}/reintentar`, {}).pipe(
      catchError(err => throwError(() => new Error(err?.error?.message ?? 'No se pudo reintentar el documento')))
    );
  }

  eliminar(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/documentos/${id}`).pipe(
      catchError(err => throwError(() => new Error(err?.error?.message ?? 'No se pudo eliminar el documento')))
    );
  }
}