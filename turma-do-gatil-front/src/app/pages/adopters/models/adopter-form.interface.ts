/**
 * Interface para o formulário de adotante
 */
export interface AdopterFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  cpf: string;
  phone: string;
  email: string;
  address: string;
  registrationDate: string;
}

/**
 * Interface para configuração de validação de campos
 */
export interface FieldValidationConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  pattern?: RegExp;
}

/**
 * Interface para mensagens de erro customizadas
 */
export interface ValidationMessages {
  [key: string]: {
    [errorType: string]: string;
  };
}

/**
 * Interface para configuração de campos do formulário
 */
export interface FormFieldConfig {
  key: keyof AdopterFormData;
  label: string;
  type: 'text' | 'email' | 'date' | 'tel' | 'mask';
  placeholder?: string;
  mask?: string;
  validation: FieldValidationConfig;
  fullWidth?: boolean;
}
