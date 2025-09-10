import { FormFieldConfig } from '../models/adopter-form.interface';
import { ADOPTERS_CONFIG, INPUT_MASKS, VALIDATION_MESSAGES } from '../constants/adopters.constants';

/**
 * Configuração dos campos do formulário de adotante
 */
export const ADOPTER_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: 'firstName',
    label: 'Nome',
    type: 'text',
    placeholder: 'Digite o primeiro nome',
    validation: {
      required: true,
      minLength: ADOPTERS_CONFIG.MIN_NAME_LENGTH
    }
  },
  {
    key: 'lastName',
    label: 'Sobrenome',
    type: 'text',
    placeholder: 'Digite o sobrenome',
    validation: {
      required: true,
      minLength: ADOPTERS_CONFIG.MIN_NAME_LENGTH
    }
  },
  {
    key: 'birthDate',
    label: 'Data de Nascimento',
    type: 'date',
    validation: {
      required: true
    }
  },
  {
    key: 'cpf',
    label: 'CPF',
    type: 'mask',
    placeholder: '000.000.000-00',
    mask: INPUT_MASKS.CPF,
    validation: {
      required: true
    }
  },
  {
    key: 'phone',
    label: 'Telefone',
    type: 'mask',
    placeholder: '(00) 00000-0000',
    mask: INPUT_MASKS.PHONE,
    validation: {
      required: true
    }
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'exemplo@email.com',
    validation: {
      required: true,
      email: true
    }
  },
  {
    key: 'address',
    label: 'Endereço Completo',
    type: 'text',
    placeholder: 'Rua, número, bairro, cidade - CEP',
    fullWidth: true,
    validation: {
      required: true,
      minLength: ADOPTERS_CONFIG.MIN_ADDRESS_LENGTH
    }
  },
  {
    key: 'registrationDate',
    label: 'Data de Cadastro',
    type: 'date',
    validation: {
      required: true
    }
  }
];

/**
 * Configuração das colunas da tabela de adotantes
 */
export const ADOPTER_TABLE_COLUMNS_CONFIG = [
  {
    key: 'firstName',
    header: 'Nome',
    type: 'text',
    sortable: true,
    width: '200px'
  },
  {
    key: 'email',
    header: 'Email',
    type: 'text',
    sortable: true,
    width: '250px'
  },
  {
    key: 'cpf',
    header: 'CPF',
    type: 'text',
    sortable: true,
    width: '150px'
  },
  {
    key: 'phone',
    header: 'Telefone',
    type: 'text',
    width: '150px'
  },
  {
    key: 'registrationDate',
    header: 'Data de Cadastro',
    type: 'date',
    sortable: true,
    width: '150px'
  }
] as const;
