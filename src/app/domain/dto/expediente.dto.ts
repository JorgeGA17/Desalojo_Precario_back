// ==============================================
// 🧠 DOMAIN (contratos puros - sin lógica)
// ==============================================

// ─────────── Estados normalizados ───────────
export type EstadoDoc = 'GENERADO' | 'EN_PROCESO' | 'ERROR';

// ───────────── BANDEJA (orden exacto) ─────────────
export interface BandejaItem {
  usuario: string;         // 1) USUARIO
  fechaRegistro: string;   // 2) FECHA REGISTRO (ISO)
  corte: string;          // 3) CORTE
  sede: string;           // 4) SEDE
  instancia: string;      // 5) INSTANCIA
  numeroExpediente: string; // 6) NÚMERO EXPEDIENTE
  juez?: string;           // 7) JUEZ
  especialista?: string;   // 8) ESPECIALISTA
  estado?: EstadoDoc;      // 9) ESTADO
  // 10) ACCIONES (opcionales)
  url?: string;
  id?: string;
}

export interface BandejaResponse {
  items: BandejaItem[];
  total: number;
  page: number;
  size: number;
}
export interface BandejaQuery {
  page: number;
  size: number;
  search?: string;
  estado?: EstadoDoc | 'TODOS';
}

// ───────────── GENERADOR (contratos) ─────────────
export interface GenerarDocsRequest {
  expedienteNumero: string; // ej: "01234-2025-0-1234-JR-CI-01"
  // futuros campos: documentos, parametros, opciones...
}
export interface DocumentoGenerado {
  id: string;
  nombre: string;      // ej: "AutoAdmision.pdf"
  estado: EstadoDoc;   // 'GENERADO' | 'EN_PROCESO' | 'ERROR'
  fecha?: string;      // ISO
  url?: string;        // enlace si está listo
  mensaje?: string;    // detalle de error si aplica
}
export interface GenerarDocsResponse {
  items: DocumentoGenerado[];
  total: number;
  jobId?: string;
}
