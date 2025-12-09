export interface Adopter {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  cpf: string;
  phone: string;
  email?: string;
  instagram?: string;
  address: string;
  registrationDate: string;
}

export interface AdopterRequest {
  firstName: string;
  lastName: string;
  birthDate?: string;
  cpf: string;
  phone: string;
  email?: string;
  instagram?: string;
  address: string;
  registrationDate: string;
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

export interface AdopterFilters {
  name?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
