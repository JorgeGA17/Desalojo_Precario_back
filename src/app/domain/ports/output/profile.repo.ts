// =========================================
// PUERTO DE SALIDA (Output Port / Repository Port)
// - Contrato que la Infraestructura implementa
// - Los Casos de Uso dependen de esta abstracción (DIP - SOLID)
// =========================================
import { UserProfile } from '../../models/user-profile.model';
import { UpdateProfileDto } from '../../dto/update-profile.dto';
import { ChangePasswordDto } from '../../dto/change-password.dto';

export interface ProfileRepositoryPort {
  getMyProfile(): Promise<UserProfile>;
  updateMyProfile(dto: UpdateProfileDto): Promise<UserProfile>;
  changeMyPassword(dto: ChangePasswordDto): Promise<void>;
}