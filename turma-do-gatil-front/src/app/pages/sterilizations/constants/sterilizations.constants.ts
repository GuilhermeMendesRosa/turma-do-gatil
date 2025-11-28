/**
 * Enums para status de esterilização
 */
export enum SterilizationStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

/**
 * Enums para status de esterilização do gato
 */
export enum SterilizationStatusType {
  ELIGIBLE = 'ELIGIBLE',
  OVERDUE = 'OVERDUE'
}

/**
 * Enums para cores de gato
 */
export enum CatColor {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
  GRAY = 'GRAY',
  ORANGE = 'ORANGE',
  BROWN = 'BROWN',
  MIXED = 'MIXED',
  OTHER = 'OTHER'
}

/**
 * Enums para sexo de gato
 */
export enum CatSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

/**
 * Enums para ações da tabela
 */
export enum SterilizationTableAction {
  SCHEDULE = 'schedule',
  EDIT = 'edit',
  COMPLETE = 'complete',
  CANCEL = 'cancel'
}

/**
 * Enums para tipos de modal
 */
export enum ModalType {
  SCHEDULE = 'schedule',
  EDIT = 'edit'
}

/**
 * Configurações de paginação e tabela
 */
export const STERILIZATIONS_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  CAT_PHOTO_WIDTH: '80px',
  DEFAULT_SORT_SCHEDULED: { field: 'sterilizationDate', direction: 'asc' as const },
  DEFAULT_SORT_COMPLETED: { field: 'sterilizationDate', direction: 'desc' as const }
} as const;

/**
 * Labels para status de esterilização
 */
export const STERILIZATION_STATUS_LABELS: Record<SterilizationStatus, string> = {
  [SterilizationStatus.SCHEDULED]: 'Agendada',
  [SterilizationStatus.COMPLETED]: 'Realizada',
  [SterilizationStatus.CANCELED]: 'Cancelada'
};

/**
 * Labels para status de elegibilidade
 */
export const STERILIZATION_STATUS_TYPE_LABELS: Record<SterilizationStatusType, string> = {
  [SterilizationStatusType.ELIGIBLE]: 'Elegível',
  [SterilizationStatusType.OVERDUE]: 'Atrasado'
};

/**
 * Labels para sexo
 */
export const SEX_LABELS: Record<CatSex, string> = {
  [CatSex.MALE]: 'Macho',
  [CatSex.FEMALE]: 'Fêmea'
};

/**
 * Labels para cores
 */
export const COLOR_LABELS: Record<CatColor, string> = {
  [CatColor.WHITE]: 'Branco',
  [CatColor.BLACK]: 'Preto',
  [CatColor.GRAY]: 'Cinza',
  [CatColor.ORANGE]: 'Laranja',
  [CatColor.BROWN]: 'Marrom',
  [CatColor.MIXED]: 'Misto',
  [CatColor.OTHER]: 'Outro'
};

/**
 * Mensagens de confirmação
 */
export const CONFIRMATION_MESSAGES = {
  CANCEL_STERILIZATION: 'Tem certeza que deseja cancelar esta esterilização?',
  COMPLETE_STERILIZATION: 'Tem certeza que deseja marcar esta esterilização como concluída?',
  DELETE_STERILIZATION: 'Tem certeza que deseja excluir esta esterilização?'
} as const;

/**
 * Configurações de estatísticas
 */
export const STATS_CONFIG = {
  ICONS: {
    TOTAL_CATS: 'pi-heart',
    ELIGIBLE: 'pi-calendar',
    SCHEDULED: 'pi-clock',
    COMPLETED: 'pi-check-circle'
  },
  COLORS: {
    TOTAL_CATS: 'primary',
    ELIGIBLE: 'warning',
    SCHEDULED: 'info',
    COMPLETED: 'success'
  }
} as const;
