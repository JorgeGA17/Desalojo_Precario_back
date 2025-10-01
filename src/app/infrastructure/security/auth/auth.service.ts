// src/app/infrastructure/security/auth/auth.service.ts
// ======================================================
// Servicio de autenticación (infraestructura Angular)
// - Habla con el backend FastAPI en /sisprecario-api/authenticate
// - Guarda token/rol en localStorage
// ======================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';   // 👈 añadido
import { environment } from '../../../../environments/environment';

// ------------------------------------------------------
// 🔹 Interface para exponer datos de sesión a la UI
// ------------------------------------------------------
export interface UserSession {
  username: string;
  backendRole: string | null; // Ej: SPREC_JUEZ
  uiRoles: string[];          // Ej: ['JUEZ']
}

// ------------------------------------------------------
// Interface que representa la respuesta del backend
// ------------------------------------------------------
interface LoginResp { 
  access_token: string;   // JWT firmado por backend
  token_type: 'bearer';   // Tipo estándar (OAuth2)
  rol: string;            // Ej: SPREC_ADMIN | SPREC_JUEZ | SPREC_SECRETARIO
  // 🔹 Futuro: backend podría devolver también la corte o perfil
  // corte?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Base URL → viene de environments/environment.ts
  // Ejemplo final: http://localhost:8000/sisprecario-api/authenticate
  
  private base = `${environment.apiUrl.replace(/\/$/, '')}/sisprecario-api/authenticate`;


  // 👇 NUEVO: BehaviorSubject con estado de sesión
  private sessionSubject = new BehaviorSubject<UserSession | null>(this.readSessionFromStorage());
  session$ = this.sessionSubject.asObservable();

  constructor(private http: HttpClient) {
// 🔎 logs temporales para verificar qué URL está usando el bundle
    console.log('[ENV apiUrl]', environment.apiUrl);
    console.log('[AUTH base]', `${environment.apiUrl.replace(/\/$/, '')}/sisprecario-api/authenticate`);
  }

  // ----------------------------------------------------
  // Método login → POST /sisprecario-api/authenticate/login
  // - Envía { username, password }
  // - Backend responde con JWT + rol
  // - Guarda datos en localStorage
  // ----------------------------------------------------
  login(username: string, password: string, corte?: string): Observable<void> {
    return this.http.post<LoginResp>(`${this.base}/login`, { username, password }).pipe(
      tap(res => {
        // 🔑 Guardar credenciales en localStorage
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('username', username);
        localStorage.setItem('rol', res.rol);

        // Roles UI (traducidos desde el rol del backend)
        localStorage.setItem('roles', JSON.stringify(this.mapBackendRolToUi(res.rol)));

        // ✅ Opcional (futuro): guardar corte si viene de BD negocio
        // if (corte) localStorage.setItem('corte', corte);
         this.emitSession(); // 👈 avisa al header
      }),
      map(() => void 0), // transforma Observable<LoginResp> → Observable<void>
    );
  }

  // ----------------------------------------------------
  // Métodos auxiliares para leer estado de sesión
  // ----------------------------------------------------
  // ------------------------------------------------------------
  // logout → limpia todo el storage relacionado con la sesión
  // ------------------------------------------------------------
  logout() { 
    ['token','username','rol','roles','corte'].forEach(k => localStorage.removeItem(k)); 
    this.emitSession(); // 👈 avisa al header
  }
   
  getToken()      { return localStorage.getItem('token'); }
  getUsername()   { return localStorage.getItem('username'); }
  getBackendRol() { return localStorage.getItem('rol'); }
  getUiRoles(): string[] { 
    try { return JSON.parse(localStorage.getItem('roles') ?? '[]'); }
    catch { return []; } }
  
  // ✅ Opcional futuro:
  // getCorte()      { return localStorage.getItem('corte'); }
  
  isLoggedIn()    { return !!this.getToken(); }

  // ----------------------------------------------------
  // Mapear roles del backend → roles usados en la UI
  // (aquí puedes ajustar según las pantallas que muestres)
  // ----------------------------------------------------
  private mapBackendRolToUi(c_rol: string | null): string[] {
    switch (c_rol) {
      case 'SPREC_ADMIN':      return ['ADMIN'];
      case 'SPREC_JUEZ':       return ['JUEZ'];
      case 'SPREC_SECRETARIO': return ['SECRETARIO'];
      default:                 return [];
    }
  }

  // 🔹 NUEVO: helpers para el BehaviorSubject
  private readSessionFromStorage(): UserSession | null {
    const token = this.getToken();
    if (!token) return null;
    return {
      username: this.getUsername() ?? '',
      backendRole: this.getBackendRol(),
      uiRoles: this.getUiRoles(),
    };
  }
  private emitSession() {
    this.sessionSubject.next(this.readSessionFromStorage());
  }
}

//📌 Con esto:
//Usas el JWT real que ya devuelve tu backend.
//Guardas solo lo necesario (token, username, rol, roles).
//Y el bloque corte queda en comentario listo para cuando la BD de negocio lo requiera.