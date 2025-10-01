// =========================================
// CASO DE USO (Aplicación de FE)
// - Implementa PUERTO DE ENTRADA (IGetMyProfileUseCase)
// - Depende de PUERTO DE SALIDA (DIP - SOLID)
// =========================================
import { IGetMyProfileUseCase } from '../domain/ports/input/get-my-profile.usecase';
import { ProfileRepositoryPort } from '../domain/ports/output/profile.repo';
import { UserProfile } from '../domain/models/user-profile.model';

export class GetMyProfileUseCase implements IGetMyProfileUseCase {
  constructor(private repo: ProfileRepositoryPort) {}
  execute(): Promise<UserProfile> {
    return this.repo.getMyProfile();
  }
}