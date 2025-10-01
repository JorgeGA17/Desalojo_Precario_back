// ================================================
// 🎯 USE CASE: Listar Bandeja (sin mock interno)
// ================================================
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BandejaQuery, BandejaResponse } from '../domain/dto/expediente.dto';

// ⛔ ELIMINADO: of, delay, map y el arreglo mock  // ELIMINADO
// ⛔ ELIMINADO: imports de EstadoDoc innecesarios   // ELIMINADO

import { BANDEJA_REPO } from '../infrastructure/security/tokens/repositories.tokens'; // NUEVO
import { IBandejaRepository } from '../domain/ports/output/bandeja.repo';                      // NUEVO

@Injectable()
export class ListarBandejaUC {
  private repo = inject<IBandejaRepository>(BANDEJA_REPO); // NUEVO

  run(q: BandejaQuery): Observable<BandejaResponse> {
    // UC delgado: delega en el puerto (mock o http según wiring)  // NUEVO
    return this.repo.listar(q);
  }
}
