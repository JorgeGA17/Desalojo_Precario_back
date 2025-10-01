// =========================================
// PUERTO DE ENTRADA (Input Port)
// - Contrato para "actualizar mi perfil"
// - Lo implementa un Caso de Uso
// =========================================
import { UpdateProfileDto } from '../../dto/update-profile.dto';
import { UserProfile } from '../../models/user-profile.model';

export interface IUpdateMyProfileUseCase {
  execute(dto: UpdateProfileDto): Promise<UserProfile>;
}