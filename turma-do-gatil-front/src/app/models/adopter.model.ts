export interface Address {
  id?: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  zipCode: string;
  complement?: string;
}

export interface Adopter {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  cpf: string;
  phone: string;
  email?: string;
  instagram?: string;
  address: Address;
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
  address: Address;
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
