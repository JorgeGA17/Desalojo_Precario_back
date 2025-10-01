// =========================================
// CASO DE USO (Aplicación de FE)
// - Implementa PUERTO DE ENTRADA (IChangeMyPasswordUseCase)
// - Depende de PUERTO DE SALIDA (DIP - SOLID)
// =========================================
import { IChangeMyPasswordUseCase } from '../domain/ports/input/change-my-password.usecase';
import { ProfileRepositoryPort } from '../domain/ports/output/profile.repo';
import { ChangePasswordDto } from '../domain/dto/change-password.dto';

export class ChangeMyPasswordUseCase implements IChangeMyPasswordUseCase {
  constructor(private repo: ProfileRepositoryPort) {}
  execute(dto: ChangePasswordDto): Promise<void> {
    return this.repo.changeMyPassword(dto);
  }
}