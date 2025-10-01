// =========================================
// DOMAIN MODEL (Entidad de negocio)
// - Representa el perfil del usuario
// - No depende de Angular ni Infraestructura
// =========================================
export interface UserProfile {
  lastName: string;
  firstName: string;
  id: string;
  username: string;
  email: string;
  fullName: string;
}