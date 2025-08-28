export interface Cat {
  id: string;
  name: string;
  color: Color;
  sex: Sex;
  birthDate: string;
  shelterEntryDate: string;
  photoUrl?: string;
  adopted: boolean;
}

export interface CatRequest {
  name: string;
  color: Color;
  sex: Sex;
  birthDate: string;
  shelterEntryDate: string;
  photoUrl?: string;
  adopted?: boolean;
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
  adopted?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
