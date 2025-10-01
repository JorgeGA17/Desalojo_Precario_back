import { InjectionToken } from '@angular/core';
import { IBandejaRepository } from '../../../domain/ports/output/bandeja.repo';

export const BANDEJA_REPO = new InjectionToken<IBandejaRepository>('BANDEJA_REPO');
