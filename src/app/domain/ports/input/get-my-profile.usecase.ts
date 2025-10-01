// =========================================
// PUERTO DE ENTRADA (Input Port)
// - Contrato que define la acción "obtener perfil"
// - Lo implementa un Caso de Uso
// =========================================
import { UserProfile } from '../../models/user-profile.model';

export interface IGetMyProfileUseCase {
  execute(): Promise<UserProfile>;
}