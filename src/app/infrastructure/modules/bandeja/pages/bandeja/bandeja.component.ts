import { Component, ComponentRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';

import { ListarBandejaUC } from '../../../../../use-cases/listar-bandeja.uc';
import { BandejaItem, BandejaQuery, BandejaResponse, EstadoDoc } from '../../../../../domain/dto/expediente.dto';

@Component({
  standalone: true,
  selector: 'sp-bandeja',
  imports: [
    CommonModule, FormsModule,
    TableModule, ButtonModule, InputTextModule, DropdownModule, TagModule, CardModule, MessageModule
  ],
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss'],
  providers: [ListarBandejaUC]
})
export class BandejaComponent {
  private uc = inject(ListarBandejaUC);

  loading = signal(false);
  error = signal<string | undefined>(undefined);

  // Estado de la tabla
  items = signal<BandejaItem[]>([]);
  total = signal(0);
  page = signal(0);
  size = signal(6);

  // Filtros (signals)
  search = signal<string>('');
  estado = signal<EstadoDoc | 'TODOS'>('TODOS');

  // Debe ser mutable (sin "as const")
  estados = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Generado', value: 'GENERADO' },
    { label: 'En proceso', value: 'EN_PROCESO' },
    { label: 'Error', value: 'ERROR' },
  ];

  ngOnInit() { this.cargar(); }

  cargar() {
    this.loading.set(true);
    this.error.set(undefined);

    const q: BandejaQuery = {
      page: this.page(),
      size: this.size(),
      search: this.search().trim() || undefined,
      estado: this.estado()
    };

    this.uc.run(q).subscribe({
      next: (res: BandejaResponse) => {
        this.items.set(res.items);
        this.total.set(res.total);
        this.page.set(res.page);
        this.size.set(res.size);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        const msg = (err as any)?.message ?? 'No se pudo cargar la bandeja';
        this.error.set(msg);
        this.loading.set(false);
      }
    });
  }

onPage(e: { first?: number; rows?: number }) {
  const rows  = e.rows  ?? this.size();
  const first = e.first ?? 0;
  if (!rows) return;                 // evita NaN / división entre 0
  this.size.set(rows);
  this.page.set(Math.floor(first / rows));
  this.cargar();
}

  colorEstado(e: EstadoDoc): 'success' | 'warning' | 'danger' {
    switch (e) {
      case 'GENERADO':  return 'success';
      case 'EN_PROCESO': return 'warning';
      case 'ERROR':     return 'danger';
      default:          return 'warning';
    }
  }

  ver(row: BandejaItem) {
    if (!row.url) return;

    const fecha = new Date(row.fechaRegistro).toLocaleString();
    const html = `
    <!doctype html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Vista previa – Documento</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        :root{ --title:#111827; --muted:#6b7280; --accent:#97080B; --border:#e5e7eb; --paper:#ffffff; --bg:#f9fafb; }
        body{margin:0;background:var(--bg);font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}
        .paper{ width:min(840px,92vw); margin:24px auto; background:var(--paper);
                border:1px solid var(--border); border-radius:12px; padding:28px 28px 40px;
                box-shadow:0 8px 24px rgba(0,0,0,.06); }
        h1{margin:0 0 4px;font-size:20px;color:var(--title)}
        .meta{color:var(--muted);font-size:13px;margin-bottom:18px}
        hr{border:0;border-top:1px solid var(--border);margin:12px 0 24px}
        .kv{display:grid;grid-template-columns:160px 1fr;gap:6px 18px;margin-bottom:6px}
        .kv .k{color:var(--muted)}
        .pill{display:inline-block;font-size:12px;border-radius:999px;padding:2px 8px;background:#dcfce7;color:#065f46;font-weight:700}
        .section h2{font-size:16px;margin:18px 0 6px;color:var(--accent)}
        .section p{margin:6px 0}
      </style>
    </head>
    <body>
      <div class="paper">
        <h1>Vista previa (simulada)</h1>
        <div class="meta">Documento generado para demostración de la bandeja</div>
        <hr/>
        <div class="kv"><div class="k">Usuario</div><div>${row.usuario}</div></div>
        <div class="kv"><div class="k">Fecha registro</div><div>${fecha}</div></div>
        <div class="kv"><div class="k">Corte</div><div>${row.corte}</div></div>
        <div class="kv"><div class="k">Sede</div><div>${row.sede}</div></div>
        <div class="kv"><div class="k">Instancia</div><div>${row.instancia}</div></div>
        <div class="kv"><div class="k">N° de expediente</div><div>${row.numeroExpediente}</div></div>
        <div class="kv"><div class="k">Juez</div><div>${row.juez}</div></div>
        <div class="kv"><div class="k">Especialista</div><div>${row.especialista}</div></div>
        <div class="kv"><div class="k">Estado</div><div><span class="pill">${row.estado}</span></div></div>

        <div class="section">
          <h2>Contenido del documento</h2>
          <p>Mock de visualización. En producción se usaría un visor (PDF/Office) o se abriría la URL real.</p>
          <p>Descarga demo: <code>/assets/docs/demo.docx</code>.</p>
        </div>

        <div class="section">
          <h2>Acciones</h2>
          <p><a href="${this.toAbsoluteUrl(row.url)}" download="documento-${row.usuario}.docx">Descargar .docx</a></p>
        </div>
      </div>
    </body>
    </html>`.trim();

    try {
      // Abrimos un Blob URL en lugar de usar document.write
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');    // evita tomar el foco/ acceso al opener
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      // Fallback: data URL por si el navegador bloquea el Blob
      const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
      window.open(dataUrl, '_blank');
    }
  }

  async descargar(row: BandejaItem) {
     if (!row.url) return;
    try {
      const abs = this.toAbsoluteUrl(row.url);
      const res = await fetch(abs);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.filename(row);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert('No se pudo descargar el documento de ejemplo.');
    }

  }

  reintentar(row: BandejaItem) {
    // TODO: llamar a servicio reintentar y luego refrescar
    if (row.estado !== 'ERROR' || !row.id) return; // guarda defensiva
    this.cargar();
  }
  eliminar(_row: BandejaItem) {
    // TODO: llamar a servicio eliminar y luego refrescar
    this.cargar();
  }

    // Utilidades (privadas)
  private toAbsoluteUrl(path: string): string {
    if (!path) return '';
    return /^https?:\/\//i.test(path) ? path : new URL(path, window.location.origin).href;
  }
  private filename(row: BandejaItem): string {
    const d = new Date(row.fechaRegistro).toISOString().slice(0,10);
    return `documento-${row.usuario}-${d}.docx`;
  }
  
}
