/**
 * Interfaces e tipos específicos para a view de adoções
 */

import { AdoptionStatus } from '../../../models/adoption.model';

/** Configuração de status para dropdown e visualização */
export interface StatusOption {
  readonly label: string;
  readonly value: AdoptionStatus;
  readonly severity: 'success' | 'warning' | 'danger' | 'info';
  readonly icon: string;
}

/** Parâmetros para carregamento de dados de adoção */
export interface AdoptionLoadParams {
  readonly page: number;
  readonly size: number;
  readonly sortBy: string;
  readonly sortDir: 'asc' | 'desc';
}

/** Estado do componente de adoções */
export interface AdoptionComponentState {
  readonly loading: boolean;
  readonly modalLoading: boolean;
  readonly showStatusModal: boolean;
  readonly first: number;
  readonly rows: number;
  readonly totalRecords: number;
}

/** Dados para atualização de status */
export interface StatusUpdateData {
  readonly adoptionId: string;
  readonly newStatus: AdoptionStatus;
  readonly currentStatus: AdoptionStatus;
}

/** Configuração de tabela para adoções */
export interface AdoptionTableConfig {
  readonly trackByProperty: string;
  readonly emptyStateIcon: string;
  readonly emptyStateMessage: string;
  readonly defaultPageSize: number;
  readonly sortField: string;
  readonly sortDirection: 'asc' | 'desc';
}

/** Constantes para configuração do componente */
export const ADOPTION_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  SORT_FIELD: 'adoptionDate',
  SORT_DIRECTION: 'desc' as const,
  TRACK_BY_PROPERTY: 'id',
  EMPTY_STATE_ICON: 'pi-info-circle',
  EMPTY_STATE_MESSAGE: 'Nenhuma adoção encontrada.',
  MODAL_WIDTH: '90vw',
  MODAL_MAX_WIDTH: '500px'
} as const;
