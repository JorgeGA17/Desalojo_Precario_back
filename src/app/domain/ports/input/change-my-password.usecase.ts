// =========================================
// PUERTO DE ENTRADA (Input Port)
// - Contrato para "cambiar contraseña"
// - Lo implementa un Caso de Uso
// =========================================
import { ChangePasswordDto } from '../../dto/change-password.dto';

export interface IChangeMyPasswordUseCase {
  execute(dto: ChangePasswordDto): Promise<void>;
}