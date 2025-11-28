import { Injectable, inject } from '@angular/core';
import { FormattingUtilsService } from '../../../shared/services/formatting-utils.service';

/**
 * Serviço para utilidades relacionadas aos adotantes
 * @deprecated Use FormattingUtilsService diretamente para formatação genérica
 */
@Injectable({
  providedIn: 'root'
})
export class AdopterUtilsService {
  private readonly formattingUtils = inject(FormattingUtilsService);

  /**
   * @deprecated Use FormattingUtilsService.formatCpf()
   */
  formatCpf(cpf: string): string {
    return this.formattingUtils.formatCpf(cpf);
  }

  /**
   * @deprecated Use FormattingUtilsService.formatPhone()
   */
  formatPhone(phone: string): string {
    return this.formattingUtils.formatPhone(phone);
  }

  /**
   * @deprecated Use FormattingUtilsService.getFullName()
   */
  getFullName(firstName: string, lastName: string): string {
    return this.formattingUtils.getFullName(firstName, lastName);
  }

  /**
   * @deprecated Use FormattingUtilsService.formatDate()
   */
  formatDate(dateString: string): string {
    return this.formattingUtils.formatDateSimple(dateString);
  }

  /**
   * @deprecated Use FormattingUtilsService.toInputDateFormat()
   */
  toInputDateFormat(dateString: string): string {
    return this.formattingUtils.toInputDateFormat(dateString);
  }

  /**
   * @deprecated Use FormattingUtilsService.getCurrentDateISO()
   */
  getCurrentDateISO(): string {
    return this.formattingUtils.getCurrentDateISO();
  }

  /**
   * @deprecated Use FormattingUtilsService.getCurrentDateForInput()
   */
  getCurrentDateForInput(): string {
    return this.formattingUtils.getCurrentDateForInput();
  }

  /**
   * @deprecated Use FormattingUtilsService.isValidCpfFormat()
   */
  isValidCpfFormat(cpf: string): boolean {
    return this.formattingUtils.isValidCpfFormat(cpf);
  }

  /**
   * @deprecated Use FormattingUtilsService.isValidPhoneFormat()
   */
  isValidPhoneFormat(phone: string): boolean {
    return this.formattingUtils.isValidPhoneFormat(phone);
  }

  /**
   * @deprecated Use FormattingUtilsService.generateActionTooltip()
   */
  generateActionTooltip(action: string, firstName: string, lastName: string): string {
    return this.formattingUtils.generateActionTooltip(action, firstName, lastName);
  }

  /**
   * @deprecated Use FormattingUtilsService.calculateAgeInYears()
   */
  calculateAge(birthDate: string): number {
    return this.formattingUtils.calculateAgeInYears(birthDate);
  }
}
