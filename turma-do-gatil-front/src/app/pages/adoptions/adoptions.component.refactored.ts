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

  /**
   * Provider de ações para cada linha da tabela
   */
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

  // ==================== CARREGAMENTO DE DADOS ====================

  /**
   * Carrega os dados de adoções com paginação
   */
  private loadAdoptionsData(): void {
    this.setLoadingState(true);
    
    const params: AdoptionLoadParams = {
      page: Math.floor(this.first / this.rows),
      size: this.rows,
      sortBy: ADOPTION_CONSTANTS.SORT_FIELD,
      sortDir: ADOPTION_CONSTANTS.SORT_DIRECTION
    };

    this.adoptionService.getAllAdoptions(params)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Erro ao carregar adoções:', error);
          return EMPTY;
        }),
        finalize(() => this.setLoadingState(false))
      )
      .subscribe({
        next: (response: Page<Adoption>) => {
          this.adoptions = response.content;
          this.totalRecords = response.totalElements;
          this.loadRelatedEntities();
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Carrega entidades relacionadas (adotantes e gatos)
   */
  private loadRelatedEntities(): void {
    const adopterIds = this.adoptionUtils.extractUniqueIds(this.adoptions, 'adopterId');
    const catIds = this.adoptionUtils.extractUniqueIds(this.adoptions, 'catId');

    this.loadAdoptersData(adopterIds);
    this.loadCatsData(catIds);
  }

  /**
   * Carrega dados dos adotantes que ainda não estão no cache
   */
  private loadAdoptersData(adopterIds: string[]): void {
    const missingAdopterIds = adopterIds.filter(id => !this.adoptersMap.has(id));
    
    if (missingAdopterIds.length === 0) return;

    const adopterRequests = missingAdopterIds.map(id =>
      this.adopterService.getAdopterById(id).pipe(
        catchError(error => {
          console.error(`Erro ao carregar adotante ${id}:`, error);
          return EMPTY;
        })
      )
    );

    forkJoin(adopterRequests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (adopters: Adopter[]) => {
          adopters.forEach((adopter, index) => {
            if (adopter) {
              this.adoptersMap.set(missingAdopterIds[index], adopter);
            }
          });
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Carrega dados dos gatos que ainda não estão no cache
   */
  private loadCatsData(catIds: string[]): void {
    const missingCatIds = catIds.filter(id => !this.catsMap.has(id));
    
    if (missingCatIds.length === 0) return;

    const catRequests = missingCatIds.map(id =>
      this.catService.getCatById(id).pipe(
        catchError(error => {
          console.error(`Erro ao carregar gato ${id}:`, error);
          return EMPTY;
        })
      )
    );

    forkJoin(catRequests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cats: Cat[]) => {
          cats.forEach((cat, index) => {
            if (cat) {
              this.catsMap.set(missingCatIds[index], cat);
            }
          });
          this.cdr.markForCheck();
        }
      });
  }

  // ==================== MÉTODOS DE PAGINAÇÃO ====================

  /**
   * Manipula mudança de página
   */
  onPageChange(page: number): void {
    this.first = page * this.rows;
    this.loadAdoptionsData();
  }

  /**
   * Navega para página anterior
   */
  onPreviousPage(): void {
    if (this.first > 0) {
      this.first = Math.max(0, this.first - this.rows);
      this.loadAdoptionsData();
    }
  }

  /**
   * Navega para próxima página
   */
  onNextPage(): void {
    if (this.first + this.rows < this.totalRecords) {
      this.first = this.first + this.rows;
      this.loadAdoptionsData();
    }
  }

  // ==================== AÇÕES DA TABELA ====================

  /**
   * Manipula ações executadas na tabela
   */
  onTableAction(event: { type: string; data: any }): void {
    const adoption = event.data as Adoption;
    
    switch (event.type) {
      case 'edit':
        this.openStatusModal(adoption);
        break;
      default:
        console.warn('Ação não reconhecida:', event.type);
    }
  }

  // ==================== MODAL DE STATUS ====================

  /**
   * Abre o modal para alteração de status
   */
  private openStatusModal(adoption: Adoption): void {
    this.selectedAdoption = adoption;
    this.selectedStatus = adoption.status;
    this.showStatusModal = true;
    this.cdr.markForCheck();
  }

  /**
   * Fecha o modal e limpa os dados selecionados
   */
  private hideModal(): void {
    this.showStatusModal = false;
    this.selectedAdoption = null;
    this.selectedStatus = '';
    this.modalLoading = false;
    this.cdr.markForCheck();
  }

  /**
   * Salva a alteração de status da adoção
   */
  private saveStatusChange(): void {
    if (!this.selectedAdoption || !this.selectedStatus || this.modalLoading) {
      return;
    }

    if (!this.adoptionUtils.isValidStatusTransition(
      this.selectedAdoption.status, 
      this.selectedStatus
    )) {
      console.warn('Transição de status inválida');
      return;
    }

    this.modalLoading = true;
    this.cdr.markForCheck();

    const updateRequest: AdoptionRequest = {
      catId: this.selectedAdoption.catId,
      adopterId: this.selectedAdoption.adopterId,
      adoptionDate: this.selectedAdoption.adoptionDate,
      status: this.selectedStatus
    };

    this.adoptionService.updateAdoption(this.selectedAdoption.id, updateRequest)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Erro ao atualizar status da adoção:', error);
          this.modalLoading = false;
          this.cdr.markForCheck();
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          this.hideModal();
          this.loadAdoptionsData();
        }
      });
  }

  // ==================== MÉTODOS AUXILIARES ====================

  /**
   * Define o estado de carregamento
   */
  private setLoadingState(loading: boolean): void {
    this.loading = loading;
    this.cdr.markForCheck();
  }

  /**
   * Obtém o nome do adotante pelo ID
   */
  private getAdopterName(adopterId: string | undefined): string {
    if (!adopterId) return '-';
    const adopter = this.adoptersMap.get(adopterId);
    return this.adoptionUtils.getAdopterName(adopterId, 
      Object.fromEntries(this.adoptersMap));
  }

  /**
   * Obtém o nome do gato pelo ID
   */
  private getCatName(catId: string | undefined): string {
    if (!catId) return '-';
    return this.adoptionUtils.getCatName(catId, 
      Object.fromEntries(this.catsMap));
  }

  // ==================== MÉTODOS LEGADOS (compatibilidade) ====================

  /**
   * @deprecated Use hideModal() instead
   */
  onHideModal(): void {
    this.hideModal();
  }

  /**
   * @deprecated Use saveStatusChange() instead
   */
  onSaveStatus(): void {
    this.saveStatusChange();
  }

  /**
   * @deprecated Use loadAdoptionsData() instead
   */
  loadAdoptions(): void {
    this.loadAdoptionsData();
  }

  /**
   * @deprecated Use adoptionUtils.formatDate() instead
   */
  formatDate(dateString: string | undefined): string {
    return this.adoptionUtils.formatDate(dateString);
  }

  /**
   * @deprecated Use adoptionUtils.getStatusLabel() instead
   */
  getStatusLabel(status: AdoptionStatus): string {
    return this.adoptionUtils.getStatusLabel(status);
  }

  /**
   * @deprecated Use adoptionUtils.getStatusClass() instead
   */
  getStatusClass(status: AdoptionStatus): string {
    return this.adoptionUtils.getStatusClass(status);
  }

  /**
   * Manipula mudança no número de linhas por página
   */
  onRowsChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.rows = +target.value;
    this.first = 0;
    this.loadAdoptionsData();
  }

  /**
   * Obtém o número mínimo de registros
   */
  getMinRecord(): number {
    return Math.min(this.first + this.rows, this.totalRecords);
  }

  /**
   * Obtém o primeiro índice da última página
   */
  getLastPageFirst(): number {
    return Math.floor(this.totalRecords / this.rows) * this.rows;
  }

  /**
   * Obtém o número da última página
   */
  getLastPage(): number {
    return Math.floor(this.totalRecords / this.rows);
  }

  /**
   * Callback para quando uma adoção é atualizada
   */
  onAdoptionUpdated(): void {
    this.loadAdoptionsData();
  }
}
