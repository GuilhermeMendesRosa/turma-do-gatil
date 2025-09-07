export enum CatAdoptionStatus {
  NAO_ADOTADO = 'NAO_ADOTADO',
  EM_PROCESSO = 'EM_PROCESSO', 
  ADOTADO = 'ADOTADO'
}

export enum Color {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
  GRAY = 'GRAY',
  BROWN = 'BROWN',
  ORANGE = 'ORANGE',
  MIXED = 'MIXED',
  CALICO = 'CALICO',
  TABBY = 'TABBY',
  SIAMESE = 'SIAMESE',
  OTHER = 'OTHER'
}

export enum Sex {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface Cat {
  id: string;
  name: string;
  color: Color;
  sex: Sex;
  birthDate: string;
  shelterEntryDate: string;
  photoUrl?: string;
  adopted: boolean;
  adoptionStatus: CatAdoptionStatus;
}

export interface CatRequest {
  name: string;
  color: Color;
  sex: Sex;
  birthDate: string;
  shelterEntryDate: string;
  photoUrl?: string;
  adopted?: boolean;
  adoptionStatus?: CatAdoptionStatus;
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

export interface CatFilters {
  name?: string;
  color?: Color;
  sex?: Sex;
  adoptionStatus?: CatAdoptionStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
