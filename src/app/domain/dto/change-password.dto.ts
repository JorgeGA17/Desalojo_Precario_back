// =========================================
// DTO (Data Transfer Object)
// - Contrato de entrada para cambio de contraseña
// - Viaja desde la UI → Caso de Uso → Infraestructura
// =========================================
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}