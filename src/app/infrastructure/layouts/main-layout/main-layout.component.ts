// =========================================
// MAIN-LAYOUT (presentación / UI state)
// - Topbar + Sidebar degradado + RouterOutlet
// - Menú con roles, búsqueda y submenús
// - Sin lógica de negocio ni HTTP
// =========================================
import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button'; // 👈 PrimeNG

// 👇 AGREGAR: para convertir Observable → Signal
import { toSignal } from '@angular/core/rxjs-interop';
// 👇 AGREGAR: importa AuthService y el tipo de sesión
import { AuthService, UserSession } from '../../security/auth/auth.service';
import { ProfileEditComponent } from "../../modules/profile/pages/editt/profile-edit.component";
import { PasswordChangeComponent } from "../../modules/profile/pages/password/password-change.component";


// 🧩 Modelo UI del menú
interface MenuItem {
  id: string;                 // Identificador estable (para expandir)
  label: string;              // Texto visible
  icon?: string;              // PrimeIcons (ej: 'pi pi-home') o emoji
  route?: string;             // Ruta a navegar (si no tiene hijos)
  roles?: string[];           // ← controla visibilidad por **roles UI**
  badge?: string | number;    // Chip (NEW, 15, etc.)
  children?: MenuItem[];      // Submenú
}

@Component({
  standalone: true,
  selector: 'sp-main-layout',
  imports: [
    CommonModule, 
    RouterLink, 
    RouterLinkActive, 
    RouterOutlet, 
    ReactiveFormsModule, 
    ButtonModule, 
 
   
  
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  // Router solo para logout/redirección (sin negocio)
  private router = inject(Router);

 // =========================================
  // 👇 NUEVO: Header reactivo (usuario + perfil)
  // =========================================
  private auth = inject(AuthService); // inyecta servicio de autenticación

  // Convierte session$ (observable) en un signal
  session = toSignal<UserSession | null>(this.auth.session$, { initialValue: null });

  // Computed → nombre de usuario (si no hay sesión: Invitado)
  username = computed(() => this.session()?.username ?? 'Invitado');

  // Computed → perfil traducido desde roles UI
  perfil = computed(() => {
    const r = this.session()?.uiRoles ?? [];
    if (r.includes('ADMIN'))      return 'Administrador';
    if (r.includes('JUEZ'))       return 'Juez';
    if (r.includes('SECRETARIO')) return 'Secretario';
    return 'Usuario Civil';
  });

  // =========================================
  // 🔒 Roles actuales del usuario (adapter real vendrá luego)
  // =========================================
  roles = signal<string[]>(this.readRolesFromStorage());

  // =========================================
  // 🔎 Búsqueda local del menú (solo UI)
  // =========================================
  search = new FormControl('', { nonNullable: true });

  // =========================================
  // 📂 Definición estática del menú (presentación)
  // =========================================
private allMenu: MenuItem[] = [
    // ✅ Inicio → visible para todos los roles UI que usamos
    { id: 'home', label: 'Inicio', icon: 'pi pi-home', route: '/home', roles: ['ADMIN','JUEZ','SECRETARIO'] }, // ← CAMBIO: usar UI roles

    {
      id: 'civil',
      label: 'Módulo Civil',
      icon: 'pi pi-sitemap',
      // ❗ IMPORTANTE:
      // Antes tenías roles: ['CIVIL','ADMIN'] y JUEZ NO veía el padre.
      // Opciones:
      //   a) No pongas 'roles' en el padre (visible para todos) y filtra en hijos (recomendado), o
      //   b) Incluye también 'JUEZ' y 'SECRETARIO'.
      // Aquí aplico (a): sin 'roles' en el padre 👇
      // roles: ['ADMIN','JUEZ','SECRETARIO'], // ← SI QUIERES limitar también el padre, descomenta esta línea
      children: [
        // 👇 Hijo: Generador → JUEZ y ADMIN
        { id: 'civil-generador',
          label: 'Generador de documentos',
          icon: 'pi pi-file-edit',
          route: '/generador',
          roles: ['JUEZ','ADMIN'] }, // ← CAMBIO: visibilidad exacta por rol UI

        // 👇 Hijo: Bandeja → SECRETARIO, JUEZ y ADMIN
        { id: 'civil-bandeja',
          label: 'Bandeja de documentos',
          icon: 'pi pi-briefcase',
          route: '/bandeja',
          badge: 'NEW',
          roles: ['SECRETARIO','JUEZ','ADMIN'] }, // ← CAMBIO: visibilidad exacta por rol UI
      ],
    },
    // ✅ Ayuda → visible para todos los roles UI
    { id: 'ayuda', label: 'Ayuda', icon: 'pi pi-info-circle', route: '/home', roles: ['ADMIN','JUEZ','SECRETARIO'] },
  ];

  // =========================================
  // ▶️ Estado de expansión por nodo
  // =========================================
  expanded = signal<Set<string>>(new Set(['civil'])); // abre "Módulo Civil" por defecto

  // =========================================
  // ✅ Menú filtrado por roles + búsqueda (UI puro)
  // =========================================
  menu = computed<MenuItem[]>(() => {
    const roles = this.roles();
    const q = (this.search.value || '').toLowerCase().trim();

    const filterTree = (nodes: MenuItem[]): MenuItem[] => nodes
      // 1) Filtra por roles
      .filter(n => !n.roles || n.roles.some(r => roles.includes(r)))
      // 2) Aplica búsqueda (en hoja o en padre si cualquier hijo coincide)
      .map(n => {
        if (n.children?.length) {
          const kids = filterTree(n.children);
          const match = n.label.toLowerCase().includes(q);
          return (q ? (match || kids.length) : true) ? { ...n, children: kids } : null as any;
        }
        return (q ? n.label.toLowerCase().includes(q) : true) ? n : null as any;
      })
      .filter(Boolean);

    return filterTree(this.allMenu);
  });
showEdit: any;

  // =========================================
  // 🔁 Alterna expansión/colapso de un nodo
  // =========================================
  toggle(id: string) {
    this.expanded.update(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // =========================================
  // 🚪 Logout (cuando tengas AuthService, reemplaza aquí)
  // =========================================
  logout() {
    ['token','username','rol','roles','corte','avatarUrl'].forEach(k => localStorage.removeItem(k));
    this.router.navigateByUrl('/auth/login');
  }

  // =========================================
  // 📦 Lectura simple de roles desde storage
  // =========================================
  private readRolesFromStorage(): string[] {
    try { return JSON.parse(localStorage.getItem('roles') || '[]'); }
    catch { return []; }
  }

  // URL del avatar (UI state). Luego vendrá del adapter de auth.
  avatarUrl = signal<string | null>(this.readAvatarUrl());

  // Si falla la carga, volvemos al placeholder
  onAvatarError() {
    this.avatarUrl.set(null);
  }

  // Stub temporal: lee la URL desde localStorage
  private readAvatarUrl(): string | null {
    try {
      return localStorage.getItem('avatarUrl'); // ej: https://i.pravatar.cc/128?img=5
    } catch {
      return null;
    }
  }
}


