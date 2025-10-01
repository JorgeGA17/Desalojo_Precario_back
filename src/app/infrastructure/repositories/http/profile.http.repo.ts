// =========================================
// ADAPTADOR SECUNDARIO (HTTP Repository)
// - Implementa PUERTO DE SALIDA (ProfileRepositoryPort)
// - Los Casos de Uso dependen de esta abstracción (DIP - SOLID)
// - Aquí se hace la llamada real a la API REST
// - Sin @Injectable y sin tokens: se instancia manualmente en la UI
// - RxJS moderno (firstValueFrom)
// =========================================
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// ⬇️ desde .../http/ → a /src/environments  (4 niveles)
import { environment } from '../../../../environments/environment';

// ⬇️ desde .../http/ → a /app/domain (3 niveles)
import { ProfileRepositoryPort } from '../../../domain/ports/output/profile.repo';
import { UserProfile } from '../../../domain/models/user-profile.model';
import { UpdateProfileDto } from '../../../domain/dto/update-profile.dto';
import { ChangePasswordDto } from '../../../domain/dto/change-password.dto';

export class ProfileHttpRepository implements ProfileRepositoryPort {
  private readonly api = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) {}

  getMyProfile(): Promise<UserProfile> {
    return firstValueFrom(this.http.get<UserProfile>(`${this.api}/me`));
  }

  updateMyProfile(dto: UpdateProfileDto): Promise<UserProfile> {
    return firstValueFrom(this.http.put<UserProfile>(`${this.api}/me`, dto));
  }

  async changeMyPassword(dto: ChangePasswordDto): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${this.api}/change-password`, dto));
  }
}