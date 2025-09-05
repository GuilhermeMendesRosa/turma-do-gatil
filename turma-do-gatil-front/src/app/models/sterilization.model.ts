export interface SterilizationStatsDto {
  eligibleCount: number;
  overdueCount: number;
  totalNeedingSterilization: number;
}

export interface CatSterilizationStatusDto {
  id: string;
  name: string;
  color: 'WHITE' | 'BLACK' | 'GRAY' | 'ORANGE' | 'BROWN' | 'MIXED' | 'OTHER';
  sex: 'MALE' | 'FEMALE';
  birthDate: string;
  shelterEntryDate: string;
  photoUrl?: string;
  ageInDays: number;
  sterilizationStatus: 'ELIGIBLE' | 'OVERDUE';
}

export interface SterilizationDto {
  id?: string;
  catId: string;
  sterilizationDate: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
  notes?: string;
  cat?: {
    id: string;
    name: string;
    color: string;
    sex: string;
    photoUrl?: string;
  };
}

export interface SterilizationRequest {
  catId: string;
  sterilizationDate: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
  notes?: string;
}

export interface SterilizationFilters {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  catId?: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
  startDate?: string;
  endDate?: string;
}

export interface Page<T> {
  content: T[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
