import { Injectable } from '@angular/core';

/**
 * Serviço para utilidades relacionadas aos adotantes
 */
@Injectable({
  providedIn: 'root'
})
export class AdopterUtilsService {

  /**
   * Formata CPF para exibição
   */
  formatCpf(cpf: string): string {
    if (!cpf) return '';
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return cpf;
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Formata telefone para exibição
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
   * Obtém o nome completo do adotante
   */
  getFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.trim();
  }

  /**
   * Formata data para exibição
   */
  formatDate(dateString: string): string {
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
   * Obtém a data atual no formato de input date
   */
  getCurrentDateForInput(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Valida se o CPF tem formato válido
   */
  isValidCpfFormat(cpf: string): boolean {
    if (!cpf) return false;
    const cleanCpf = cpf.replace(/\D/g, '');
    return cleanCpf.length === 11;
  }

  /**
   * Valida se o telefone tem formato válido
   */
  isValidPhoneFormat(phone: string): boolean {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  }

  /**
   * Gera tooltip para ação da tabela
   */
  generateActionTooltip(action: string, firstName: string, lastName: string): string {
    const fullName = this.getFullName(firstName, lastName);
    const actionMap: { [key: string]: string } = {
      'edit': `Editar ${fullName}`,
      'delete': `Excluir ${fullName}`,
      'view': `Visualizar ${fullName}`
    };
    return actionMap[action] || `${action} ${fullName}`;
  }

  /**
   * Calcula a idade com base na data de nascimento
   */
  calculateAge(birthDate: string): number {
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
}
