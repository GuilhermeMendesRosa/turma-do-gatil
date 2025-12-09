import { Injectable } from '@angular/core';

/**
 * Serviço utilitário centralizado para formatação de dados
 * 
 * Consolida formatação de:
 * - CPF e telefone
 * - Datas
 * - Nomes
 * - Cálculo de idade
 * 
 * Este serviço substitui AdopterUtilsService, partes de AdoptionUtilsService
 * e CatDisplayService relacionadas a formatação.
 */
@Injectable({
  providedIn: 'root'
})
export class FormattingUtilsService {

  // ==================== FORMATAÇÃO DE CPF ====================

  /**
   * Formata CPF para exibição (XXX.XXX.XXX-XX)
   */
  formatCpf(cpf: string): string {
    if (!cpf) return '';
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return cpf;
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Valida se o CPF tem formato válido (11 dígitos)
   */
  isValidCpfFormat(cpf: string): boolean {
    if (!cpf) return false;
    const cleanCpf = cpf.replace(/\D/g, '');
    return cleanCpf.length === 11;
  }

  /**
   * Remove formatação do CPF, retornando apenas números
   */
  cleanCpf(cpf: string): string {
    return cpf?.replace(/\D/g, '') || '';
  }

  // ==================== FORMATAÇÃO DE TELEFONE ====================

  /**
   * Formata telefone para exibição
   * Suporta formatos: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
   */
  formatPhone(phone: string): string {
    if (!phone) return '';
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
  }

  /**
   * Valida se o telefone tem formato válido (10 ou 11 dígitos)
   */
  isValidPhoneFormat(phone: string): boolean {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  }

  /**
   * Remove formatação do telefone, retornando apenas números
   */
  cleanPhone(phone: string): string {
    return phone?.replace(/\D/g, '') || '';
  }

  // ==================== FORMATAÇÃO DE DATAS ====================

  /**
   * Formata data para exibição no padrão brasileiro (DD/MM/YYYY)
   */
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  }

  /**
   * Formata data para exibição simples (sem opções extras)
   */
  formatDateSimple(dateString: string): string {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  }

  /**
   * Converte data para formato de input date (YYYY-MM-DD)
   */
  toInputDateFormat(dateString: string): string {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  /**
   * Obtém a data atual no formato ISO
   */
  getCurrentDateISO(): string {
    return new Date().toISOString();
  }

  /**
   * Obtém a data atual no formato de input date (YYYY-MM-DD)
   */
  getCurrentDateForInput(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Verifica se uma string de data é válida
   */
  isValidDate(dateString: string): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  // ==================== FORMATAÇÃO DE NOMES ====================

  /**
   * Obtém o nome completo concatenando primeiro e último nome
   */
  getFullName(firstName: string, lastName: string): string {
    return `${firstName || ''} ${lastName || ''}`.trim();
  }

  /**
   * Gera tooltip para ação da tabela
   */
  generateActionTooltip(action: string, firstName: string, lastName?: string): string {
    const name = lastName ? this.getFullName(firstName, lastName) : firstName;
    const actionMap: { [key: string]: string } = {
      'edit': `Editar ${name}`,
      'delete': `Excluir ${name}`,
      'view': `Visualizar ${name}`,
      'details': `Ver detalhes de ${name}`,
      'adopt': `Adotar ${name}`
    };
    return actionMap[action] || `${action} ${name}`;
  }

  // ==================== CÁLCULO DE IDADE ====================

  /**
   * Calcula a idade em anos com base na data de nascimento
   */
  calculateAgeInYears(birthDate?: string): number {
    if (!birthDate) return 0;
    
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return 0;
    }
  }

  /**
   * Calcula a idade formatada (meses ou anos)
   * Ideal para exibição de idade de animais
   */
  calculateAgeFormatted(birthDate?: string): string {
    if (!birthDate) return '-';
    
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + 
                          (today.getMonth() - birth.getMonth());
      
      if (ageInMonths < 12) {
        return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
      } else {
        const years = Math.floor(ageInMonths / 12);
        return `${years} ${years === 1 ? 'ano' : 'anos'}`;
      }
    } catch {
      return '-';
    }
  }

  // ==================== UTILITÁRIOS GERAIS ====================

  /**
   * Verifica se duas listas de IDs são equivalentes
   */
  areIdListsEqual(list1: string[], list2: string[]): boolean {
    if (list1.length !== list2.length) return false;
    
    const set1 = new Set(list1);
    const set2 = new Set(list2);
    
    return set1.size === set2.size && [...set1].every(id => set2.has(id));
  }

  /**
   * Extrai IDs únicos de uma propriedade de uma lista de objetos
   */
  extractUniqueIds<T>(items: T[], propertyName: keyof T): string[] {
    const ids = items
      .map(item => item[propertyName] as unknown as string)
      .filter(Boolean);
    
    return Array.from(new Set(ids));
  }

  /**
   * Trunca texto com ellipsis
   */
  truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Capitaliza primeira letra de cada palavra
   */
  capitalizeWords(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
