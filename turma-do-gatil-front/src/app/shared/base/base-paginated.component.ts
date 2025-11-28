import { Directive, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { PaginationInfo } from '../components';
import { FormattingUtilsService } from '../services/formatting-utils.service';

/**
 * Interface para configuração de ordenação
 */
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Interface base para filtros de paginação
 */
export interface BaseFilters {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc' | 'ASC' | 'DESC';
}

/**
 * Interface para estado de paginação
 */
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  first: number;
}

/**
 * Constantes padrão para paginação
 */
export const DEFAULT_PAGINATION_CONFIG = {
  PAGE_SIZE: 10,
  INITIAL_PAGE: 0,
  ROWS_PER_PAGE_OPTIONS: [5, 10, 20, 50]
} as const;

/**
 * Classe base abstrata para componentes com paginação
 * 
 * Fornece funcionalidades comuns:
 * - Gerenciamento de destroy$ para unsubscribe
 * - Lógica de paginação
 * - Estado de loading
 * - Acesso ao FormattingUtilsService
 * 
 * @example
 * ```typescript
 * export class AdoptersComponent extends BasePaginatedComponent implements OnInit {
 *   protected pageSize = 10;
 *   
 *   ngOnInit(): void {
 *     this.loadData();
 *   }
 *   
 *   private loadData(): void {
 *     this.setLoading(true);
 *     this.service.getData(this.buildPaginationFilters())
 *       .pipe(takeUntil(this.destroy$))
 *       .subscribe({
 *         next: (response) => this.handleDataLoaded(response),
 *         error: (error) => this.handleError(error)
 *       });
 *   }
 * }
 * ```
 */
@Directive()
export abstract class BasePaginatedComponent implements OnDestroy {
  
  // ==================== INJEÇÃO DE DEPENDÊNCIAS ====================
  
  /** Serviço utilitário de formatação */
  protected readonly formattingUtils = inject(FormattingUtilsService);
  
  // ==================== LIFECYCLE ====================
  
  /** Subject para gerenciamento de subscriptions */
  protected readonly destroy$ = new Subject<void>();
  
  // ==================== ESTADO DE LOADING ====================
  
  /** Flag de carregamento principal */
  protected loading = false;
  
  /** Mapa de estados de loading por chave */
  protected loadingStates: Record<string, boolean> = {};
  
  // ==================== PAGINAÇÃO ====================
  
  /** Índice do primeiro registro da página atual */
  protected first = 0;
  
  /** Número de registros por página - deve ser sobrescrito pela classe filha */
  protected abstract readonly pageSize: number;
  
  /** Total de registros */
  protected totalRecords = 0;
  
  // ==================== LIFECYCLE HOOKS ====================
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // ==================== MÉTODOS DE LOADING ====================
  
  /**
   * Define o estado de loading principal
   */
  protected setLoading(loading: boolean): void {
    this.loading = loading;
  }
  
  /**
   * Define um estado de loading específico por chave
   */
  protected setLoadingState(key: string, loading: boolean): void {
    this.loadingStates[key] = loading;
  }
  
  /**
   * Obtém o estado de loading de uma chave específica
   */
  protected isLoading(key?: string): boolean {
    if (key) {
      return this.loadingStates[key] ?? false;
    }
    return this.loading;
  }
  
  /**
   * Reseta todos os estados de loading
   */
  protected resetLoadingStates(): void {
    this.loading = false;
    this.loadingStates = {};
  }
  
  // ==================== MÉTODOS DE PAGINAÇÃO ====================
  
  /**
   * Obtém informações de paginação no formato do componente genérico
   */
  protected getPaginationInfo(): PaginationInfo {
    const currentPage = Math.floor(this.first / this.pageSize);
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    
    return {
      totalElements: this.totalRecords,
      numberOfElements: Math.min(this.pageSize, this.totalRecords - this.first),
      first: this.first === 0,
      last: this.first + this.pageSize >= this.totalRecords,
      totalPages,
      currentPage
    };
  }
  
  /**
   * Constrói objeto de filtros para paginação
   */
  protected buildPaginationFilters(additionalFilters?: Record<string, any>): BaseFilters {
    return {
      page: Math.floor(this.first / this.pageSize),
      size: this.pageSize,
      ...additionalFilters
    };
  }
  
  /**
   * Atualiza estado de paginação baseado em evento de mudança de página
   */
  protected updatePaginationFromEvent(event: { first: number; rows: number; page: number }): void {
    this.first = event.first;
  }
  
  /**
   * Reseta a paginação para a primeira página
   */
  protected resetPagination(): void {
    this.first = 0;
    this.totalRecords = 0;
  }
  
  /**
   * Verifica se pode navegar para página anterior
   */
  protected canGoPreviousPage(): boolean {
    return this.first > 0;
  }
  
  /**
   * Verifica se pode navegar para próxima página
   */
  protected canGoNextPage(): boolean {
    return this.first + this.pageSize < this.totalRecords;
  }
  
  /**
   * Navega para página anterior
   */
  protected previousPage(): void {
    if (this.canGoPreviousPage()) {
      this.first -= this.pageSize;
      this.onPageChange();
    }
  }
  
  /**
   * Navega para próxima página
   */
  protected nextPage(): void {
    if (this.canGoNextPage()) {
      this.first += this.pageSize;
      this.onPageChange();
    }
  }
  
  /**
   * Navega para página específica
   */
  protected goToPage(page: number): void {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (page >= 0 && page < totalPages) {
      this.first = page * this.pageSize;
      this.onPageChange();
    }
  }
  
  /**
   * Método a ser implementado pelas classes filhas para reagir a mudanças de página
   */
  protected abstract onPageChange(): void;
  
  // ==================== MÉTODOS DE FORMATAÇÃO (DELEGADOS) ====================
  
  /**
   * Formata CPF para exibição
   */
  protected formatCpf(cpf: string): string {
    return this.formattingUtils.formatCpf(cpf);
  }
  
  /**
   * Formata telefone para exibição
   */
  protected formatPhone(phone: string): string {
    return this.formattingUtils.formatPhone(phone);
  }
  
  /**
   * Formata data para exibição
   */
  protected formatDate(dateString: string | undefined): string {
    return this.formattingUtils.formatDate(dateString);
  }
  
  /**
   * Obtém nome completo
   */
  protected getFullName(firstName: string, lastName: string): string {
    return this.formattingUtils.getFullName(firstName, lastName);
  }
  
  /**
   * Calcula idade formatada
   */
  protected calculateAgeFormatted(birthDate: string): string {
    return this.formattingUtils.calculateAgeFormatted(birthDate);
  }
  
  /**
   * Gera tooltip para ação
   */
  protected generateActionTooltip(action: string, name: string, lastName?: string): string {
    return this.formattingUtils.generateActionTooltip(action, name, lastName);
  }
  
  // ==================== MÉTODOS UTILITÁRIOS ====================
  
  /**
   * Método utilitário para lidar com erros de forma padronizada
   */
  protected handleError(error: any, context: string = 'operação'): void {
    console.error(`Erro durante ${context}:`, error);
    this.setLoading(false);
  }
  
  /**
   * Obtém data atual para input date
   */
  protected getCurrentDateForInput(): string {
    return this.formattingUtils.getCurrentDateForInput();
  }
  
  /**
   * Converte data para formato de input
   */
  protected toInputDateFormat(dateString: string): string {
    return this.formattingUtils.toInputDateFormat(dateString);
  }
}
