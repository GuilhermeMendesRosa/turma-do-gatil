/**
 * Constantes para o componente de gatos
 */

import { CatAdoptionStatus, Color, Sex } from '../../../models/cat.model';
import { FilterOption } from '../models/cats-view.interface';

/**
 * Configurações padrão para o componente
 */
export const CATS_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  DEFAULT_ADOPTION_STATUS: CatAdoptionStatus.NAO_ADOTADO,
  DEFAULT_SORT_FIELD: 'name',
  DEFAULT_SORT_DIRECTION: 'asc' as const,
  SKELETON_ITEMS_COUNT: 12,
  MIN_GRID_COLUMN_WIDTH: 320,
  MAX_CONTAINER_WIDTH: 1400
} as const;

/**
 * URLs de imagens padrão
 */
export const DEFAULT_IMAGES = {
  CAT_PLACEHOLDER: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
} as const;

/**
 * Opções para dropdown de cores
 */
export const COLOR_OPTIONS: FilterOption<Color>[] = [
  { label: 'Todas as cores', value: null },
  { label: 'Branco', value: Color.WHITE },
  { label: 'Preto', value: Color.BLACK },
  { label: 'Cinza', value: Color.GRAY },
  { label: 'Marrom', value: Color.BROWN },
  { label: 'Laranja', value: Color.ORANGE },
  { label: 'Misto', value: Color.MIXED },
  { label: 'Cálico', value: Color.CALICO },
  { label: 'Tigrado', value: Color.TABBY },
  { label: 'Siamês', value: Color.SIAMESE },
  { label: 'Outro', value: Color.OTHER }
];

/**
 * Opções para dropdown de sexo
 */
export const SEX_OPTIONS: FilterOption<Sex>[] = [
  { label: 'Todos os sexos', value: null },
  { label: 'Macho', value: Sex.MALE },
  { label: 'Fêmea', value: Sex.FEMALE }
];

/**
 * Opções para dropdown de status de adoção
 */
export const ADOPTION_STATUS_OPTIONS: FilterOption<CatAdoptionStatus>[] = [
  { label: 'Disponíveis para adoção', value: CatAdoptionStatus.NAO_ADOTADO },
  { label: 'Todos os gatos', value: null },
  { label: 'Em processo de adoção', value: CatAdoptionStatus.EM_PROCESSO },
  { label: 'Já adotados', value: CatAdoptionStatus.ADOTADO }
];

/**
 * Opções para dropdown de ordenação
 */
export const SORT_OPTIONS: FilterOption<string>[] = [
  { label: 'Nome (A-Z)', value: 'name' },
  { label: 'Nome (Z-A)', value: 'name-desc' },
  { label: 'Idade (Mais novo)', value: 'birthDate' },
  { label: 'Idade (Mais velho)', value: 'birthDate-desc' },
  { label: 'Data de entrada (Mais recente)', value: 'shelterEntryDate' },
  { label: 'Data de entrada (Mais antiga)', value: 'shelterEntryDate-desc' }
];

/**
 * Opções para tamanho de página
 */
export const PAGE_SIZE_OPTIONS: FilterOption<number>[] = [
  { label: '6', value: 6 },
  { label: '12', value: 12 },
  { label: '24', value: 24 },
  { label: '48', value: 48 }
];

/**
 * Mapeamento de cores para labels em português
 */
export const COLOR_LABELS: Record<Color, string> = {
  [Color.WHITE]: 'Branco',
  [Color.BLACK]: 'Preto',
  [Color.GRAY]: 'Cinza',
  [Color.BROWN]: 'Marrom',
  [Color.ORANGE]: 'Laranja',
  [Color.MIXED]: 'Misto',
  [Color.CALICO]: 'Cálico',
  [Color.TABBY]: 'Tigrado',
  [Color.SIAMESE]: 'Siamês',
  [Color.OTHER]: 'Outro'
};

/**
 * Mapeamento de sexo para labels em português
 */
export const SEX_LABELS: Record<Sex, string> = {
  [Sex.MALE]: 'Macho',
  [Sex.FEMALE]: 'Fêmea'
};

/**
 * Configuração de status de adoção
 */
export const ADOPTION_STATUS_CONFIG = {
  [CatAdoptionStatus.NAO_ADOTADO]: {
    text: 'Disponível',
    icon: 'fa-heart',
    cssClass: ''
  },
  [CatAdoptionStatus.EM_PROCESSO]: {
    text: 'Em Processo',
    icon: 'fa-clock',
    cssClass: 'in-process'
  },
  [CatAdoptionStatus.ADOTADO]: {
    text: 'Adotado',
    icon: 'fa-home',
    cssClass: 'adopted'
  }
} as const;

/**
 * Configurações de botões
 */
export const BUTTON_CONFIGS = {
  NEW_CAT: {
    label: 'Novo Gato',
    icon: 'pi-plus',
    severity: 'primary' as const,
    size: 'small' as const
  },
  CLEAR_FILTERS: {
    label: 'Limpar',
    icon: 'pi-filter-slash',
    severity: 'secondary' as const,
    outlined: true,
    size: 'small' as const
  },
  CLEAR_FILTERS_EMPTY: {
    label: 'Limpar Filtros',
    icon: 'pi-filter-slash',
    severity: 'secondary' as const,
    outlined: true
  }
} as const;
