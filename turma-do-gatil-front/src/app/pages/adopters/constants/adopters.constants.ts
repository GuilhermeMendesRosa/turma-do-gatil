/**
 * Enums para ações da tabela de adotantes
 */
export enum AdopterTableAction {
  EDIT = 'edit',
  DELETE = 'delete'
}

/**
 * Enums para tipos de modal
 */
export enum ModalType {
  CREATE = 'create',
  EDIT = 'edit'
}

/**
 * Enums para ordenação
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

/**
 * Enums para campos ordenáveis
 */
export enum SortableFields {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL = 'email',
  CPF = 'cpf',
  REGISTRATION_DATE = 'registrationDate'
}

/**
 * Constantes de configuração
 */
export const ADOPTERS_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_NAME_LENGTH: 2,
  MIN_ADDRESS_LENGTH: 5,
  DEBOUNCE_TIME: 300
} as const;

/**
 * Constantes de máscaras
 */
export const INPUT_MASKS = {
  CPF: '999.999.999-99',
  PHONE: '(99) 99999-9999'
} as const;

/**
 * Constantes de mensagens
 */
export const VALIDATION_MESSAGES = {
  firstName: {
    required: 'Nome é obrigatório',
    minlength: `Nome deve ter no mínimo ${ADOPTERS_CONFIG.MIN_NAME_LENGTH} caracteres`
  },
  lastName: {
    required: 'Sobrenome é obrigatório',
    minlength: `Sobrenome deve ter no mínimo ${ADOPTERS_CONFIG.MIN_NAME_LENGTH} caracteres`
  },
  birthDate: {
    required: 'Data de nascimento é obrigatória'
  },
  cpf: {
    required: 'CPF é obrigatório'
  },
  phone: {
    required: 'Telefone é obrigatório'
  },
  email: {
    required: 'Email é obrigatório',
    email: 'Email inválido'
  },
  address: {
    required: 'Endereço é obrigatório',
    minlength: `Endereço deve ter no mínimo ${ADOPTERS_CONFIG.MIN_ADDRESS_LENGTH} caracteres`
  },
  registrationDate: {
    required: 'Data de cadastro é obrigatória'
  }
} as const;
