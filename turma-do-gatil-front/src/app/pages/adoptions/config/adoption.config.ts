/**
 * Configurações e constantes para o componente de adoções
 */

import { AdoptionStatus } from '../../../models/adoption.model';
import { StatusOption, AdoptionTableConfig } from '../models/adoption-view.model';
import { TableColumn, TableEmptyState } from '../../../shared/components';

/** Opções de status disponíveis para seleção */
export const STATUS_OPTIONS: readonly StatusOption[] = [
  {
    label: 'Pendente',
    value: AdoptionStatus.PENDING,
    severity: 'warning',
    icon: 'pi-clock'
  },
  {
    label: 'Concluída',
    value: AdoptionStatus.COMPLETED,
    severity: 'success',
    icon: 'pi-check-circle'
  },
  {
    label: 'Cancelada',
    value: AdoptionStatus.CANCELED,
    severity: 'danger',
    icon: 'pi-times-circle'
  }
] as const;

/** Configuração da tabela de adoções */
export const ADOPTION_TABLE_CONFIG: AdoptionTableConfig = {
  trackByProperty: 'id',
  emptyStateIcon: 'pi pi-inbox',
  emptyStateMessage: 'Nenhuma adoção encontrada.',
  defaultPageSize: 10,
  sortField: 'adoptionDate',
  sortDirection: 'desc'
} as const;

/** Estado vazio para a tabela */
export const EMPTY_STATE: TableEmptyState = {
  icon: ADOPTION_TABLE_CONFIG.emptyStateIcon,
  message: ADOPTION_TABLE_CONFIG.emptyStateMessage
} as const;

/** Estado vazio alternativo com ícone mais compatível */
export const EMPTY_STATE_FALLBACK: TableEmptyState = {
  icon: 'pi pi-search',
  message: 'Nenhuma adoção encontrada.'
} as const;

/** Configuração de colunas da tabela */
export function createTableColumns(
  getCatName: (catId: string) => string,
  getAdopterName: (adopterId: string) => string,
  formatDate: (date: string) => string,
  getStatusLabel: (status: AdoptionStatus) => string,
  getStatusClass: (status: AdoptionStatus) => string
): TableColumn[] {
  return [
    {
      key: 'catId',
      header: 'Gato',
      type: 'text',
      formatter: getCatName
    },
    {
      key: 'adopterId',
      header: 'Adotante',
      type: 'text',
      formatter: getAdopterName
    },
    {
      key: 'adoptionDate',
      header: 'Data da Adoção',
      type: 'date',
      formatter: formatDate
    },
    {
      key: 'status',
      header: 'Status',
      type: 'badge',
      formatter: getStatusLabel,
      badgeClass: getStatusClass
    }
  ];
}

/** Configurações do modal */
export const MODAL_CONFIG = {
  dialogStyle: { 
    width: '90vw', 
    maxWidth: '500px' 
  },
  title: 'Alterar Status da Adoção'
} as const;
