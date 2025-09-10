import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messageService: MessageService) { }

  showSuccess(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: message,
      life: 3000
    });
  }

  showError(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: message,
      life: 5000
    });
  }

  showWarning(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Atenção',
      detail: message,
      life: 4000
    });
  }

  showInfo(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Informação',
      detail: message,
      life: 3000
    });
  }

  /**
   * Mostra uma mensagem de erro baseada no status HTTP
   */
  showHttpError(error: any): void {
    let message = 'Ocorreu um erro inesperado. Tente novamente.';
    
    if (error?.status) {
      switch (error.status) {
        case 400:
          message = 'Dados inválidos. Verifique as informações e tente novamente.';
          break;
        case 401:
          message = 'Você não tem permissão para realizar esta ação.';
          break;
        case 403:
          message = 'Acesso negado.';
          break;
        case 404:
          message = 'Recurso não encontrado.';
          break;
        case 409:
          message = 'Conflito de dados. Verifique se o registro já existe.';
          break;
        case 422:
          message = 'Dados não podem ser processados. Verifique as informações.';
          break;
        case 500:
          message = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        case 503:
          message = 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
          break;
        default:
          message = `Erro ${error.status}: ${error.message || 'Ocorreu um erro inesperado.'}`;
      }
    }

    // Se há uma mensagem específica do backend, usa ela
    if (error?.error?.message) {
      message = error.error.message;
    }

    this.showError(message);
  }
}
