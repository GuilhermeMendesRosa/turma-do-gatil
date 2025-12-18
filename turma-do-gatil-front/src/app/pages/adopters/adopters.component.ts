import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';

import { AdopterService } from '../../services/adopter.service';
import { Adopter, AdopterFilters, AdopterRequest } from '../../models/adopter.model';
import { 
  DataTableComponent,
  TableColumn,
  TableEmptyState,
  ActionButtonConfig,
  ContentCardComponent,
  PageHeaderComponent,
  RefreshButtonComponent,
  PaginationComponent,
  PaginationInfo,
  ModalButtonComponent,
  ConfirmationModalComponent,
  ConfirmationConfig,
  LoadingStateComponent
} from '../../shared/components';
import { FormattingUtilsService } from '../../shared/services/formatting-utils.service';

// Imports das configurações locais
import { 
  AdopterTableAction, 
  ModalType, 
  SortDirection,
  ADOPTERS_CONFIG 
} from './constants/adopters.constants';
import { AdopterDetailsModalComponent } from './adopter-details-modal/adopter-details-modal.component';
import { AdopterCreateModalComponent } from './adopter-create-modal/adopter-create-modal.component';

/**
 * Componente responsável pela gestão de adotantes
 * 
 * Funcionalidades:
 * - Listagem paginada de adotantes
 * - Filtros de busca
 * - Criação e edição de adotantes
 * - Exclusão de adotantes
 * - Validação de formulários
 */
@Component({
  selector: 'app-adopters',
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush, // Temporariamente removido para resolver problema de loading
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    DataTableComponent,
    ContentCardComponent,
    PageHeaderComponent,
    RefreshButtonComponent,
    PaginationComponent,
    ModalButtonComponent,
    ConfirmationModalComponent,
    LoadingStateComponent,
    AdopterDetailsModalComponent,
    AdopterCreateModalComponent
  ],
  templateUrl: './adopters.component.html',
  styleUrls: ['./adopters.component.css']
})
export class AdoptersComponent implements OnInit, OnDestroy {
  // ==================== DEPENDENCY INJECTION ====================
  private readonly adopterService = inject(AdopterService);
  private readonly formattingUtils = inject(FormattingUtilsService);
  private readonly destroy$ = new Subject<void>();

  // ==================== DADOS E ESTADO ====================
  adopters: Adopter[] = [];
  totalRecords = 0;
  loading = false;
  
  // ==================== PAGINAÇÃO ====================
  first = 0;
  readonly rows = ADOPTERS_CONFIG.DEFAULT_PAGE_SIZE;
  
  // ==================== MODAL E FORMULÁRIO ====================
  showCreateModal = false;
  showDetailsModal = false;
  selectedAdopter: Adopter | null = null;
  
  // ==================== CONFIRMATION MODAL ====================
  confirmationModalVisible = false;
  confirmationConfig: ConfirmationConfig = {
    title: 'Confirmar',
    message: 'Tem certeza que deseja continuar?'
  };
  private pendingConfirmationAction: (() => void) | null = null;
  
  // ==================== FILTROS ====================
  filters: AdopterFilters = {
    page: 0,
    size: ADOPTERS_CONFIG.DEFAULT_PAGE_SIZE,
    sortBy: 'firstName',
    sortDir: SortDirection.ASC
  };

  // ==================== CONFIGURAÇÕES DA TABELA ====================
  readonly adoptersTableColumns: TableColumn[] = this.buildTableColumns();
  readonly emptyState: TableEmptyState = {
    icon: 'pi pi-users',
    message: 'Nenhum adotante encontrado.'
  };

  // ==================== LIFECYCLE HOOKS ====================
  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==================== INICIALIZAÇÃO ====================
  /**
   * Inicializa o componente
   */
  private initializeComponent(): void {
    this.loadAdopters();
  }

  // ==================== CONFIGURAÇÃO DA TABELA ====================
  /**
   * Constrói as colunas da tabela
   */
  private buildTableColumns(): TableColumn[] {
    return [
      {
        key: 'firstName',
        header: 'Nome',
        type: 'text',
        sortable: true,
        formatter: (value: string, item: Adopter) => 
          this.formattingUtils.getFullName(item.firstName, item.lastName)
      },
      {
        key: 'cpf',
        header: 'CPF',
        type: 'text',
        sortable: true,
        formatter: (value: string) => this.formattingUtils.formatCpf(value)
      },
      {
        key: 'phone',
        header: 'Telefone',
        type: 'text',
        formatter: (value: string) => this.formattingUtils.formatPhone(value)
      },
      {
        key: 'instagram',
        header: 'Instagram',
        type: 'text',
        formatter: (value: string) => value ? `@${value.replace('@', '')}` : '-'
      },
      {
        key: 'registrationDate',
        header: 'Data de Cadastro',
        type: 'date',
        sortable: true,
        formatter: (value: string) => this.formattingUtils.formatDate(value)
      }
    ];
  }

  // ==================== CARREGAMENTO DE DADOS ====================
  /**
   * Carrega lista de adotantes com filtros aplicados
   */
  loadAdopters(): void {
    console.log('🔄 Iniciando carregamento de adotantes...', this.filters);
    this.loading = true;
    
    this.adopterService.getAllAdopters(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✅ Adotantes carregados com sucesso:', response);
          this.adopters = response.content;
          this.totalRecords = response.totalElements;
          this.loading = false;
          console.log('📊 Estado atualizado:', { 
            adopters: this.adopters.length, 
            totalRecords: this.totalRecords, 
            loading: this.loading 
          });
        },
        error: (error) => {
          console.error('❌ Erro ao carregar adotantes:', error);
          this.loading = false;
        }
      });
  }

  // ==================== EVENTOS DE PAGINAÇÃO ====================
  /**
   * Manipula mudança de página
   */
  onPageChange(event: any): void {
    this.updatePaginationFilters(event);
    this.loadAdopters();
  }

  /**
   * Atualiza filtros de paginação
   */
  private updatePaginationFilters(event: any): void {
    this.first = event.first;
    this.filters = {
      ...this.filters,
      page: event.page,
      size: event.rows
    };
  }

  /**
   * Manipula mudança de ordenação
   */
  onSort(event: any): void {
    this.filters = {
      ...this.filters,
      sortBy: event.field,
      sortDir: event.order === 1 ? SortDirection.ASC : SortDirection.DESC
    };
    this.loadAdopters();
  }

  /**
   * Manipula mudança no número de linhas por página
   */
  onRowsChange(event: any): void {
    const target = event.target as HTMLSelectElement;
    const newRowsPerPage = +target.value;
    
    this.onPageChange({
      first: 0, 
      rows: newRowsPerPage, 
      page: 0
    });
  }

  /**
   * Manipula mudança nos filtros
   */
  onFilterChange(): void {
    this.first = 0;
    this.filters = {
      ...this.filters,
      page: 0
    };
    this.loadAdopters();
  }

  // ==================== AÇÕES DA TABELA ====================
  /**
   * Fornece ações disponíveis para cada linha da tabela
   */
  getAdopterActions = (adopter: Adopter): ActionButtonConfig[] => {
    return [
      {
        type: AdopterTableAction.VIEW,
        tooltip: 'Ver detalhes'
      },
      {
        type: AdopterTableAction.EDIT,
        tooltip: this.formattingUtils.generateActionTooltip('edit', adopter.firstName, adopter.lastName)
      },
      {
        type: 'cancel',
        tooltip: this.formattingUtils.generateActionTooltip('delete', adopter.firstName, adopter.lastName)
      }
    ];
  };

  /**
   * Manipula ações da tabela
   */
  onAdopterTableAction(event: {type: string, data: Adopter}): void {
    switch (event.type) {
      case AdopterTableAction.VIEW:
        this.openDetailsModal(event.data);
        break;
      case AdopterTableAction.EDIT:
        this.openEditModal(event.data);
        break;
      case 'cancel':
        this.confirmDeleteAdopter(event.data);
        break;
    }
  }

  /**
   * Confirma exclusão de adotante
   */
  private confirmDeleteAdopter(adopter: Adopter): void {
    const fullName = this.formattingUtils.getFullName(adopter.firstName, adopter.lastName);
    
    const config: ConfirmationConfig = {
      title: 'Excluir Adotante',
      message: `Confirma a exclusão do adotante ${fullName}?`,
      confirmLabel: 'Sim, excluir',
      cancelLabel: 'Cancelar',
      icon: 'pi pi-trash',
      severity: 'danger',
      details: [
        `CPF: ${this.formattingUtils.formatCpf(adopter.cpf)}`,
        `Telefone: ${this.formattingUtils.formatPhone(adopter.phone)}`,
        'Esta ação não pode ser desfeita',
        'Todas as informações do adotante serão removidas permanentemente'
      ]
    };

    this.showConfirmation(config, () => {
      this.deleteAdopter(adopter);
    });
  }

  /**
   * Exclui adotante
   */
  private deleteAdopter(adopter: Adopter): void {
    this.adopterService.deleteAdopter(adopter.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleAdopterDeleted(),
        error: (error) => this.handleDeleteError(error)
      });
  }

  /**
   * Manipula sucesso na exclusão
   */
  private handleAdopterDeleted(): void {
    this.loadAdopters();
  }

  /**
   * Manipula erro na exclusão
   */
  private handleDeleteError(error: any): void {
    console.error('Erro ao excluir adotante:', error);
    alert('Erro ao excluir adotante. Tente novamente.');
  }

  // ==================== CONFIRMATION MODAL METHODS ====================
  
  /**
   * Shows confirmation modal with custom configuration
   */
  private showConfirmation(config: ConfirmationConfig, onConfirm: () => void): void {
    this.confirmationConfig = config;
    this.pendingConfirmationAction = onConfirm;
    this.confirmationModalVisible = true;
  }

  /**
   * Handles confirmation modal confirmation
   */
  onConfirmationConfirmed(): void {
    if (this.pendingConfirmationAction) {
      this.pendingConfirmationAction();
      this.pendingConfirmationAction = null;
    }
  }

  /**
   * Handles confirmation modal cancellation
   */
  onConfirmationCancelled(): void {
    this.pendingConfirmationAction = null;
  }

  // ==================== MÉTODOS DE PAGINAÇÃO ====================
  /**
   * Obtém informações da paginação atual
   */
  getPaginationInfo(): PaginationInfo {
    return {
      totalElements: this.totalRecords,
      numberOfElements: this.adopters.length,
      first: this.first === 0,
      last: this.first + this.rows >= this.totalRecords,
      totalPages: Math.ceil(this.totalRecords / this.rows),
      currentPage: Math.floor(this.first / this.rows)
    };
  }

  /**
   * Navega para página anterior
   */
  previousPage(): void {
    if (this.canGoPreviousPage()) {
      this.onPageChange({
        first: this.first - this.rows,
        rows: this.rows,
        page: Math.floor(this.first / this.rows) - 1
      });
    }
  }

  /**
   * Navega para próxima página
   */
  nextPage(): void {
    if (this.canGoNextPage()) {
      this.onPageChange({
        first: this.first + this.rows,
        rows: this.rows,
        page: Math.floor(this.first / this.rows) + 1
      });
    }
  }

  /**
   * Navega para página específica
   */
  goToPage(event: any): void {
    const page = parseInt(event.target.value);
    if (this.isValidPage(page)) {
      this.onPageChange({
        first: page * this.rows,
        rows: this.rows,
        page: page
      });
    }
  }

  /**
   * Verifica se pode navegar para página anterior
   */
  private canGoPreviousPage(): boolean {
    return this.first > 0;
  }

  /**
   * Verifica se pode navegar para próxima página
   */
  private canGoNextPage(): boolean {
    return this.first + this.rows < this.totalRecords;
  }

  /**
   * Valida se o número da página é válido
   */
  private isValidPage(page: number): boolean {
    const totalPages = Math.ceil(this.totalRecords / this.rows);
    return page >= 0 && page < totalPages;
  }

  // ==================== MÉTODOS DO MODAL ====================
  /**
   * Abre modal de detalhes do adotante
   */
  openDetailsModal(adopter: Adopter): void {
    this.selectedAdopter = adopter;
    this.showDetailsModal = true;
  }

  /**
   * Abre modal para criação de novo adotante
   */
  openCreateModal(): void {
    this.selectedAdopter = null;
    this.showCreateModal = true;
  }

  /**
   * Abre modal para edição de adotante
   */
  openEditModal(adopter: Adopter): void {
    this.selectedAdopter = adopter;
    this.showCreateModal = true;
  }

  /**
   * Callback quando adotante é salvo (criado ou atualizado)
   */
  onAdopterSaved(): void {
    this.loadAdopters();
    this.showCreateModal = false;
    this.selectedAdopter = null;
  }

  // ==================== CONFIGURAÇÃO DE BOTÕES E AÇÕES ====================
  /**
   * Obtém configuração do botão de novo adotante
   */
  getNewAdopterButtonConfig() {
    return {
      label: 'Novo Adotante',
      icon: 'pi-plus',
      severity: 'primary' as const,
      action: this.openCreateModal.bind(this)
    };
  }
}
