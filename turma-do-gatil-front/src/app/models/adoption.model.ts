export interface Adoption {
  id: string;
  catId: string;
  adopterId: string;
  adoptionDate: string;
  status: AdoptionStatus;
  adoptionTermPhoto?: string;
}

export interface AdoptionRequest {
  catId: string;
  adopterId: string;
  adoptionDate: string;
  status: AdoptionStatus;
  adoptionTermPhoto?: string;
}

export enum AdoptionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface AdoptionFilters {
  status?: AdoptionStatus;
  catId?: string;
  adopterId?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
