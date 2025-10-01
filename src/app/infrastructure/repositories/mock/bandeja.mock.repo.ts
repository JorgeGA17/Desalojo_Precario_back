import { Injectable } from '@angular/core';
import { IBandejaRepository } from '../../../domain/ports/output/bandeja.repo';
import { BandejaItem, BandejaQuery, BandejaResponse } from '../../../domain/dto/expediente.dto';
import { Observable, of, delay, map } from 'rxjs';

@Injectable()
export class BandejaMockRepo implements IBandejaRepository {
  listar(q: BandejaQuery): Observable<BandejaResponse> {
    // ⚠️ MOCK MOVIDO DESDE EL USE CASE  // NUEVO
    const mockItems: BandejaItem[] = [
      {
        usuario: 'rmelgarejot',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior de Lima',
        sede:  'SJL – Sede Central',
        instancia: '1° Juzgado Civil',
        numeroExpediente: '01234-2025-0-1801-JR-CI-01',
        juez: 'Dr. Pérez',
        especialista: 'Lic. López',
        estado: 'GENERADO',
        url: 'assets/docs/demo.docx',
        id: '1'
      },
      {
        usuario: 'jgarcia',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior de Lima',
        sede:  'SJL – Sede Central',
        instancia: '1° Juzgado Civil',
        numeroExpediente: '05678-2025-0-1801-JR-CI-01',
        juez: 'Dr. Pérez',
        especialista: 'Lic. López',
        estado: 'GENERADO',
        url: 'assets/docs/demo.docx',
        id: '2'
      },
            {
        usuario: 'jgarcia',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior de Lima',
        sede:  'SJL – Sede Central',
        instancia: '1° Juzgado Civil',
        numeroExpediente: '05678-2025-0-1801-JR-CI-01',
        juez: 'Dr. Pérez',
        especialista: 'Lic. López',
        estado: 'GENERADO',
        url: 'assets/docs/demo.docx',
        id: '3'
      },
            {
        usuario: 'jgarcia',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior de Lima',
        sede:  'SJL – Sede Central',
        instancia: '1° Juzgado Civil',
        numeroExpediente: '05678-2025-0-1801-JR-CI-01',
        juez: 'Dr. Pérez',
        especialista: 'Lic. López',
        estado: 'GENERADO',
        url: 'assets/docs/demo.docx',
        id: '4'
      },
            {
        usuario: 'jgarcia',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior de Lima',
        sede:  'SJL – Sede Central',
        instancia: '1° Juzgado Civil',
        numeroExpediente: '05678-2025-0-1801-JR-CI-01',
        juez: 'Dr. Pérez',
        especialista: 'Lic. López',
        estado: 'GENERADO',
        url: 'assets/docs/demo.docx',
        id: '5'
      },
            {
        usuario: 'jgarcia',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior de Lima',
        sede:  'SJL – Sede Central',
        instancia: '1° Juzgado Civil',
        numeroExpediente: '05678-2025-0-1801-JR-CI-01',
        juez: 'Dr. Pérez',
        especialista: 'Lic. López',
        estado: 'GENERADO',
        url: 'assets/docs/demo.docx',
        id: '6'
      },
            {
        usuario: 'jgarcia',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior de Lima',
        sede:  'SJL – Sede Central',
        instancia: '1° Juzgado Civil',
        numeroExpediente: '05678-2025-0-1801-JR-CI-01',
        juez: 'Dr. Pérez',
        especialista: 'Lic. López',
        estado: 'GENERADO',
        url: 'assets/docs/demo.docx',
        id: '7'
      },
            {
        usuario: 'jgarcia',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior de Lima',
        sede:  'SJL – Sede Central',
        instancia: '1° Juzgado Civil',
        numeroExpediente: '05678-2025-0-1801-JR-CI-01',
        juez: 'Dr. Pérez',
        especialista: 'Lic. López',
        estado: 'GENERADO',
        url: 'assets/docs/demo.docx',
        id: '8'
      },
            {
        usuario: 'jgarcia',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior de Lima',
        sede:  'SJL – Sede Central',
        instancia: '1° Juzgado Civil',
        numeroExpediente: '05678-2025-0-1801-JR-CI-01',
        juez: 'Dr. Pérez',
        especialista: 'Lic. López',
        estado: 'GENERADO',
        url: 'assets/docs/demo.docx',
        id: '9'
      },
            {
        usuario: 'jgarcia',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior de Lima',
        sede:  'SJL – Sede Central',
        instancia: '1° Juzgado Civil',
        numeroExpediente: '05678-2025-0-1801-JR-CI-01',
        juez: 'Dr. Pérez',
        especialista: 'Lic. López',
        estado: 'GENERADO',
        url: 'assets/docs/demo.docx',
        id: '10'
      },
            {
        usuario: 'jgarcia',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior de Lima',
        sede:  'SJL – Sede Central',
        instancia: '1° Juzgado Civil',
        numeroExpediente: '05678-2025-0-1801-JR-CI-01',
        juez: 'Dr. Pérez',
        especialista: 'Lic. López',
        estado: 'GENERADO',
        url: 'assets/docs/demo.docx',
        id: '11'
      },
      {
        usuario: 'kcordova',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior del Callao',
        sede:  'Sede La Perla',
        instancia: '2° Juzgado Civil',
        numeroExpediente: '03456-2025-0-0701-JR-CI-02',
        juez: 'Dra. Ramírez',
        especialista: 'Abg. Torres',
        estado: 'EN_PROCESO',
        url: 'https://example.com/AutoAdmision.pdf',
        id: '12'
      },
            {
        usuario: 'kcordova',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior del Callao',
        sede:  'Sede La Perla',
        instancia: '2° Juzgado Civil',
        numeroExpediente: '03456-2025-0-0701-JR-CI-02',
        juez: 'Dra. Ramírez',
        especialista: 'Abg. Torres',
        estado: 'EN_PROCESO',
        url: 'https://example.com/AutoAdmision.pdf',
        id: '13'
      },
                  {
        usuario: 'kcordova',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior del Callao',
        sede:  'Sede La Perla',
        instancia: '2° Juzgado Civil',
        numeroExpediente: '03456-2025-0-0701-JR-CI-02',
        juez: 'Dra. Ramírez',
        especialista: 'Abg. Torres',
        estado: 'EN_PROCESO',
        url: 'https://example.com/AutoAdmision.pdf',
        id: '14'
      },
                  {
        usuario: 'kcordova',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior del Callao',
        sede:  'Sede La Perla',
        instancia: '2° Juzgado Civil',
        numeroExpediente: '03456-2025-0-0701-JR-CI-02',
        juez: 'Dra. Ramírez',
        especialista: 'Abg. Torres',
        estado: 'EN_PROCESO',
        url: 'https://example.com/AutoAdmision.pdf',
        id: '15'
      },
                  {
        usuario: 'kcordova',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior del Callao',
        sede:  'Sede La Perla',
        instancia: '2° Juzgado Civil',
        numeroExpediente: '03456-2025-0-0701-JR-CI-02',
        juez: 'Dra. Ramírez',
        especialista: 'Abg. Torres',
        estado: 'EN_PROCESO',
        url: 'https://example.com/AutoAdmision.pdf',
        id: '16'
      },
                  {
        usuario: 'kcordova',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior del Callao',
        sede:  'Sede La Perla',
        instancia: '2° Juzgado Civil',
        numeroExpediente: '03456-2025-0-0701-JR-CI-02',
        juez: 'Dra. Ramírez',
        especialista: 'Abg. Torres',
        estado: 'EN_PROCESO',
        url: 'https://example.com/AutoAdmision.pdf',
        id: '17'
      },
                  {
        usuario: 'kcordova',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior del Callao',
        sede:  'Sede La Perla',
        instancia: '2° Juzgado Civil',
        numeroExpediente: '03456-2025-0-0701-JR-CI-02',
        juez: 'Dra. Ramírez',
        especialista: 'Abg. Torres',
        estado: 'EN_PROCESO',
        url: 'https://example.com/AutoAdmision.pdf',
        id: '18'
      },
      {
        usuario: 'elucero',
        fechaRegistro: new Date().toISOString(),
        corte: 'Corte Superior de Lima Norte',
        sede:  'SJL – Sede 2',
        instancia: '3° Juzgado Civil',
        numeroExpediente: '07890-2025-0-3201-JR-CI-03',
        juez: 'Dr. Chávez',
        especialista: 'Lic. Díaz',
        estado: 'ERROR',
        id: '19'
      },
      // ... (tus otros ítems mock idénticos a los que ya tienes)
    ];

    return of(mockItems).pipe(
      delay(400),
      map(items => {
        // 🔎 Filtro: amplío a corte/sede/expediente para ser coherentes con la UI  // CAMBIO
        const term = (q.search ?? '').toLowerCase().trim();
        if (term) {
          items = items.filter(i =>
            i.usuario.toLowerCase().includes(term) ||
            i.instancia.toLowerCase().includes(term) ||
            (i.corte ?? '').toLowerCase().includes(term) ||
            (i.sede ?? '').toLowerCase().includes(term) ||
            (i.numeroExpediente ?? '').toLowerCase().includes(term)
          );
        }

        if (q.estado && q.estado !== 'TODOS') {
          items = items.filter(i => i.estado === q.estado);
        }

        const page = Math.max(0, q.page ?? 0);
        const size = Math.min(Math.max(5, q.size ?? 10), 100);
        const total = items.length;
        const start = page * size;
        const pageItems = items.slice(start, start + size);

        return { items: pageItems, total, page, size } as BandejaResponse;
      })
    );
  }

  reintentar(_id: string) { return of(void 0).pipe(delay(300)); }
  eliminar(_id: string)   { return of(void 0).pipe(delay(300)); }
}
