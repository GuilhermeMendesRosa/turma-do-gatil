/**
 * Interfaces específicas para a view de gatos
 */

import { Cat, CatAdoptionStatus, Color, Sex } from '../../../models/cat.model';

/**
 * Interface para opções de filtros dropdown
 */
export interface FilterOption<T = any> {
  label: string;
  value: T | null;
}

/**
 * Interface para configuração de paginação
 */
export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  pageSizeOptions: FilterOption<number>[];
}

/**
 * Interface para estado de loading
 */
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

/**
 * Interface para estado dos diálogos
 */
export interface DialogsState {
  catDetails: {
    visible: boolean;
    cat: Cat | null;
  };
  catCreateEdit: {
    visible: boolean;
    cat: Cat | null; // null para criação, preenchido para edição
  };
  deleteConfirm: {
    visible: boolean;
    cat: Cat | null;
  };
}

/**
 * Interface para configuração de cards de estatísticas
 */
export interface StatsConfig {
  available: {
    count: number;
    label: string;
    description: string;
  };
  adopted: {
    count: number;
    label: string;
    description: string;
  };
  total: {
    count: number;
    label: string;
    description: string;
  };
}

/**
 * Interface para configuração de ordenação
 */
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
  options: FilterOption<string>[];
}

/**
 * Interface para informações de display de um gato
 */
export interface CatDisplayInfo {
  id: string;
  name: string;
  age: string;
  colorLabel: string;
  sexLabel: string;
  entryDateFormatted: string;
  adoptionStatus: {
    text: string;
    icon: string;
    cssClass: string;
  };
  imageUrl: string;
}
