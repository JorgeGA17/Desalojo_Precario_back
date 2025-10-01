// =========================================
// DTO (Data Transfer Object)
// - Contrato de entrada para actualizar perfil
// - Viaja desde la UI → Caso de Uso → Infraestructura
// =========================================
export interface UpdateProfileDto {
  fullName: string;
  email: string;
}