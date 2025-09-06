import { Cat } from './cat.model';
import { Adopter } from './adopter.model';
import { SterilizationDto } from './sterilization.model';

export interface DashboardSummary {
  availableCats: Cat[];
  pendingSterilizations: SterilizationDto[];
  registeredAdopters: Adopter[];
}
