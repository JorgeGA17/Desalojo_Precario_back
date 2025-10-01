// =========================================
// CASO DE USO (Aplicación de FE)
// - Implementa PUERTO DE ENTRADA (IUpdateMyProfileUseCase)
// - Depende de PUERTO DE SALIDA (DIP - SOLID)
// =========================================
import { IUpdateMyProfileUseCase } from '../domain/ports/input/update-my-profile.usecase';
import { ProfileRepositoryPort } from '../domain/ports/output/profile.repo';
import { UpdateProfileDto } from '../domain/dto/update-profile.dto';
import { UserProfile } from '../domain/models/user-profile.model';

export class UpdateMyProfileUseCase implements IUpdateMyProfileUseCase {
  constructor(private repo: ProfileRepositoryPort) {}
  execute(dto: UpdateProfileDto): Promise<UserProfile> {
    return this.repo.updateMyProfile(dto);
  }
}