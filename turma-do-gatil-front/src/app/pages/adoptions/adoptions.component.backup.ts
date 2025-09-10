
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, forkJoin, EMPTY } from 'rxjs';
import { takeUntil, catchError, finalize } from 'rxjs/operators';

// Services
import { AdoptionService } from '../../services/adoption.service';
import { AdopterService } from '../../services/adopter.service';
import { CatService } from '../../services/cat.service';
import { AdoptionUtilsService } from './services/adoption-utils.service';

// Models
import { Adoption, AdoptionStatus, Page, AdoptionRequest } from '../../models/adoption.model';
import { Adopter } from '../../models/adopter.model';
import { Cat } from '../../models/cat.model';

// View Models and Config
import { 
  AdoptionComponentState, 
  AdoptionLoadParams,
  StatusUpdateData,
  ADOPTION_CONSTANTS
} from './models/adoption-view.model';
import { 
  STATUS_OPTIONS, 
  MODAL_CONFIG, 
  EMPTY_STATE,
  createTableColumns
} from './config/adoption.config';

// Shared Components
import { 
  PageHeaderComponent,
  ContentCardComponent,
  DataTableComponent,
  PaginationComponent,
  GenericModalComponent,
  ActionButtonConfig,
  TableColumn,
  TableEmptyState,
  PaginationInfo,
  ModalAction
} from '../../shared/components';

/**
 * Componente para gestão de adoções
 * 
 * Este componente gerencia a visualização e edição de adoções,
 * incluindo alteração de status e paginação de dados.
 * 
 * @author Sistema Turma do Gatil
 * @version 2.0.0
 */
@Component({
  selector: 'app-adoptions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    ContentCardComponent,
    DataTableComponent,
    PaginationComponent,
    GenericModalComponent
  ],
  templateUrl: './adoptions.component.html',
  styleUrls: ['./adoptions.component.css']
})
export class AdoptionsComponent implements OnInit, OnDestroy {
  
  // ==================== PROPRIEDADES PÚBLICAS ====================
  
  /** Lista de adoções carregadas */
  adoptions: Adoption[] = [];
  
  /** Total de registros para paginação */
  totalRecords: number = 0;
  
  /** Estado de carregamento da lista */
  loading: boolean = false;
  
  /** Estado de carregamento do modal */
  modalLoading: boolean = false;
  
  /** Controle de visibilidade do modal */
  showStatusModal: boolean = false;
  
  /** Adoção selecionada para edição */
  selectedAdoption: Adoption | null = null;
  
  /** Status selecionado no modal */
  selectedStatus: AdoptionStatus | '' = '';
  
  // ==================== PROPRIEDADES DE PAGINAÇÃO ====================
  
  /** Índice do primeiro registro da página atual */
  first: number = 0;
  
  /** Número de registros por página */
  rows: number = ADOPTION_CONSTANTS.DEFAULT_PAGE_SIZE;
  
  // ==================== MAPAS DE DADOS RELACIONADOS ====================
  
  /** Mapa de adotantes indexados por ID */
  private readonly adoptersMap: Map<string, Adopter> = new Map();
  
  /** Mapa de gatos indexados por ID */
  private readonly catsMap: Map<string, Cat> = new Map();
  
  // ==================== CONFIGURAÇÕES ====================
  
  /** Configuração das colunas da tabela */
  tableColumns: TableColumn[] = [];
  
  /** Estado vazio da tabela */
  readonly emptyState: TableEmptyState = EMPTY_STATE;
  
  /** Opções de status disponíveis */
  readonly statusOptions = STATUS_OPTIONS;
  
  /** Configuração do modal */
  readonly modalConfig = MODAL_CONFIG;
  
  // ==================== OBSERVABLES E LIFECYCLE ====================
  
  /** Subject para gerenciar unsubscribe */
  private readonly destroy$ = new Subject<void>();

  // ==================== PROPRIEDADES COMPUTADAS ====================
  
  /**
   * Informações de paginação para o componente genérico
   */
  get paginationInfo(): PaginationInfo {
    const currentPage = Math.floor(this.first / this.rows);
    const totalPages = Math.ceil(this.totalRecords / this.rows);
    
    return {
      totalElements: this.totalRecords,
      numberOfElements: Math.min(this.rows, this.totalRecords - this.first),
      first: this.first === 0,
      last: this.first + this.rows >= this.totalRecords,
      totalPages,
      currentPage
    };
  }

  /**
   * Ações disponíveis para o modal
   */
  get modalActions(): ModalAction[] {
    return [
      {
        label: 'Cancelar',
        icon: 'pi-times',
        severity: 'secondary',
        outlined: true,
        action: () => this.hideModal()
      },
      {
        label: 'Salvar',
        icon: 'pi-check',
        severity: 'primary',
        loading: this.modalLoading,
        disabled: !this.selectedStatus || this.modalLoading,
        action: () => this.saveStatusChange()
      }
    ];
  }

  // ==================== CONSTRUTOR ====================

  constructor(
    private readonly adoptionService: AdoptionService,
    private readonly adopterService: AdopterService,
    private readonly catService: CatService,
    private readonly adoptionUtils: AdoptionUtilsService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.initializeTableColumns();
  }

  // ==================== LIFECYCLE HOOKS ====================

  ngOnInit(): void {
    this.loadAdoptionsData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==================== INICIALIZAÇÃO ====================

  /**
   * Inicializa as configurações das colunas da tabela
   */
  private initializeTableColumns(): void {
    this.tableColumns = createTableColumns(
      (catId: string) => this.getCatName(catId),
      (adopterId: string) => this.getAdopterName(adopterId),
      (date: string) => this.adoptionUtils.formatDate(date),
      (status: AdoptionStatus) => this.adoptionUtils.getStatusLabel(status),
      (status: AdoptionStatus) => this.adoptionUtils.getStatusClass(status)
    );
  }

  // Provider de ações para cada linha da tabela
  getRowActions = (adoption: Adoption): ActionButtonConfig[] => {
    return [
      {
        type: 'edit',
        tooltip: 'Alterar Status',
        disabled: false,
        visible: true
      }
    ];
  };

  constructor(
    private adoptionService: AdoptionService,
    private adopterService: AdopterService,
    private catService: CatService
  ) {}

  ngOnInit(): void {
    this.loadAdoptions();
  }

  // === MÉTODOS DE CARREGAMENTO DE DADOS ===
  
  loadAdoptions(): void {
    this.loading = true;
    this.adoptionService.getAllAdoptions({
      page: this.first / this.rows,
      size: this.rows,
      sortBy: 'adoptionDate',
      sortDir: 'desc'
    }).subscribe({
      next: (response) => {
        this.adoptions = response.content;
        this.totalRecords = response.totalElements;
        this.loading = false;
        this.loadRelatedEntities();
      },
      error: (error) => {
        console.error('Erro ao carregar adoções:', error);
        this.loading = false;
      }
    });
  }

  loadRelatedEntities(): void {
    // Carrega adotantes e gatos relacionados às adoções
    const adopterIds = Array.from(new Set(this.adoptions.map(a => a.adopterId)));
    const catIds = Array.from(new Set(this.adoptions.map(a => a.catId)));

    adopterIds.forEach(id => {
      if (!this.adoptersMap[id]) {
        this.adopterService.getAdopterById(id).subscribe({
          next: (adopter) => this.adoptersMap[id] = adopter
        });
      }
    });

    catIds.forEach(id => {
      if (!this.catsMap[id]) {
        this.catService.getCatById(id).subscribe({
          next: (cat) => this.catsMap[id] = cat
        });
      }
    });
  }

  // === MÉTODOS DE PAGINAÇÃO ===

  onPageChange(page: number): void {
    this.first = page * this.rows;
    this.loadAdoptions();
  }

  onPreviousPage(): void {
    if (this.first > 0) {
      this.first = Math.max(0, this.first - this.rows);
      this.loadAdoptions();
    }
  }

  onNextPage(): void {
    if (this.first + this.rows < this.totalRecords) {
      this.first = this.first + this.rows;
      this.loadAdoptions();
    }
  }

  // === MÉTODOS DE AÇÕES DA TABELA ===

  onTableAction(event: {type: string, data: any}): void {
    const adoption = event.data as Adoption;
    
    switch (event.type) {
      case 'edit':
        this.openStatusModal(adoption);
        break;
      default:
        console.warn('Ação não reconhecida:', event.type);
    }
  }

  // === MÉTODOS DO MODAL ===

  openStatusModal(adoption: Adoption): void {
    this.selectedAdoption = adoption;
    this.selectedStatus = adoption.status;
    this.showStatusModal = true;
  }

  onHideModal(): void {
    this.showStatusModal = false;
    this.selectedAdoption = null;
    this.selectedStatus = '';
    this.modalLoading = false;
  }

  onSaveStatus(): void {
    if (!this.selectedAdoption || !this.selectedStatus || this.modalLoading) {
      return;
    }

    this.modalLoading = true;

    const adoptionRequest = {
      catId: this.selectedAdoption.catId,
      adopterId: this.selectedAdoption.adopterId,
      adoptionDate: this.selectedAdoption.adoptionDate,
      status: this.selectedStatus
    };

    this.adoptionService.updateAdoption(this.selectedAdoption.id, adoptionRequest).subscribe({
      next: () => {
        this.modalLoading = false;
        this.onHideModal();
        this.loadAdoptions(); // Recarrega a lista
      },
      error: (error) => {
        console.error('Erro ao atualizar status da adoção:', error);
        this.modalLoading = false;
      }
    });
  }

  // === MÉTODOS AUXILIARES ===

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  getAdopterName(adopterId: string | undefined): string {
    if (!adopterId) return '-';
    const adopter = this.adoptersMap[adopterId];
    return adopter ? `${adopter.firstName} ${adopter.lastName}` : '...';
  }

  getCatName(catId: string | undefined): string {
    if (!catId) return '-';
    const cat = this.catsMap[catId];
    return cat ? cat.name : '...';
  }

  getStatusLabel(status: AdoptionStatus): string {
    switch (status) {
      case AdoptionStatus.COMPLETED: return 'Concluída';
      case AdoptionStatus.PENDING: return 'Pendente';
      case AdoptionStatus.CANCELED: return 'Cancelada';
      default: return status;
    }
  }

  getStatusClass(status: AdoptionStatus): string {
    switch (status) {
      case AdoptionStatus.COMPLETED: return 'completed';
      case AdoptionStatus.PENDING: return 'pending';
      case AdoptionStatus.CANCELED: return 'canceled';
      default: return '';
    }
  }

  // === MÉTODOS LEGADOS (mantidos para compatibilidade) ===

  onRowsChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.rows = +target.value;
    this.first = 0;
    this.loadAdoptions();
  }

  getMinRecord(): number {
    return Math.min(this.first + this.rows, this.totalRecords);
  }

  getLastPageFirst(): number {
    return Math.floor(this.totalRecords / this.rows) * this.rows;
  }

  getLastPage(): number {
    return Math.floor(this.totalRecords / this.rows);
  }

  onAdoptionUpdated(): void {
    this.loadAdoptions();
  }
}
