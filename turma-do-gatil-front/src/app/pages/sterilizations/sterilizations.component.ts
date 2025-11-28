import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, finalize } from 'rxjs';
import { SterilizationService } from '../../services/sterilization.service';
import { 
  SterilizationStatsDto, 
  CatSterilizationStatusDto, 
  SterilizationDto,
  Page,
  SterilizationRequest
} from '../../models/sterilization.model';
import { SterilizationScheduleModalComponent } from './sterilization-schedule-modal/sterilization-schedule-modal.component';
import { 
  RefreshButtonComponent,
  PaginationComponent,
  ActionButtonConfig,
  PaginationInfo,
  StatsGridComponent,
  ContentCardComponent,
  PageHeaderComponent,
  StatCardData,
  DataTableComponent,
  TableColumn,
  TableEmptyState,
  ConfirmationModalComponent,
  ConfirmationConfig,
  LoadingStateComponent
} from '../../shared/components';

// Imports das constantes extraídas
import {
  SterilizationStatus,
  SterilizationStatusType,
  CatColor,
  CatSex,
  STERILIZATIONS_CONFIG,
  STERILIZATION_STATUS_LABELS,
  STERILIZATION_STATUS_TYPE_LABELS,
  SEX_LABELS,
  COLOR_LABELS
} from './constants/sterilizations.constants';

/**
 * Sterilizations management component
 * 
 * Manages cats sterilizations including:
 * - Viewing cats that need sterilization
 * - Scheduling sterilizations
 * - Managing scheduled and completed sterilizations
 * - Statistics and reporting
 */
@Component({
  selector: 'app-sterilizations',
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush, // Temporariamente removido para resolver problema de loading
  imports: [
    CommonModule, 
    SterilizationScheduleModalComponent,
    RefreshButtonComponent,
    PaginationComponent,
    StatsGridComponent,
    ContentCardComponent,
    PageHeaderComponent,
    DataTableComponent,
    ConfirmationModalComponent,
    LoadingStateComponent
  ],
  templateUrl: './sterilizations.component.html',
  styleUrls: ['./sterilizations.component.css']
})
export class SterilizationsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // ===== DATA PROPERTIES =====
  stats: SterilizationStatsDto | null = null;
  catsNeedingSterilization: CatSterilizationStatusDto[] = [];
  scheduledSterilizations: SterilizationDto[] = [];
  completedSterilizations: SterilizationDto[] = [];
  
  // ===== LOADING STATES =====
  loadingCats = false;
  loadingSterilizations = false;
  loadingCompletedSterilizations = false;
  
  // ===== MODAL STATE =====
  readonly modalState = {
    scheduleModalVisible: false,
    selectedCatForSchedule: null as CatSterilizationStatusDto | null,
    selectedSterilizationForEdit: null as SterilizationDto | null
  };

  // ===== CONFIRMATION MODAL STATE =====
  confirmationModalVisible = false;
  confirmationConfig: ConfirmationConfig = {
    title: 'Confirmar',
    message: 'Tem certeza que deseja continuar?'
  };
  private pendingConfirmationAction: (() => void) | null = null;
  
  // ===== PAGINATION STATE =====
  readonly paginationState = {
    scheduled: {
      currentPage: 0,
      pageSize: STERILIZATIONS_CONFIG.DEFAULT_PAGE_SIZE,
      pagination: {} as Page<SterilizationDto>
    },
    completed: {
      currentPage: 0,
      pageSize: STERILIZATIONS_CONFIG.DEFAULT_PAGE_SIZE,
      pagination: {} as Page<SterilizationDto>
    }
  };

  // ===== EMPTY STATES =====
  readonly emptyStates = {
    cats: {
      icon: 'pi pi-check-circle',
      message: 'Não há gatos que precisam de castração no momento!'
    } as TableEmptyState,
    scheduled: {
      icon: 'pi pi-calendar-times',
      message: 'Nenhuma castração agendada no momento.'
    } as TableEmptyState,
    completed: {
      icon: 'pi pi-info-circle',
      message: 'Nenhuma castração foi realizada ainda.'
    } as TableEmptyState
  };

  // ===== TABLE COLUMNS =====
  readonly catsTableColumns: TableColumn[] = [
    {
      key: 'photoUrl',
      header: 'Foto',
      type: 'image',
      width: STERILIZATIONS_CONFIG.CAT_PHOTO_WIDTH,
      imageProperty: 'photoUrl',
      imageAlt: 'name',
      imagePlaceholder: 'pi pi-image'
    },
    {
      key: 'name',
      header: 'Nome',
      type: 'text',
      formatter: (value: string) => value || 'Sem nome'
    },
    {
      key: 'sex',
      header: 'Sexo',
      type: 'text',
      formatter: (value: string) => this.formatSexLabel(value)
    },
    {
      key: 'color',
      header: 'Cor',
      type: 'text',
      formatter: (value: string) => this.formatColorLabel(value)
    },
    {
      key: 'ageInDays',
      header: 'Idade',
      type: 'text',
      formatter: (value: number) => `${value} dias`
    },
    {
      key: 'sterilizationStatus',
      header: 'Status',
      type: 'badge',
      formatter: (value: string) => this.formatStatusLabel(value),
      badgeClass: (value: string) => value.toLowerCase()
    }
  ];

  readonly scheduledTableColumns: TableColumn[] = [
    {
      key: 'cat',
      header: 'Gato',
      type: 'cat-info'
    },
    {
      key: 'sterilizationDate',
      header: 'Data Agendada',
      type: 'date'
    },
    {
      key: 'status',
      header: 'Status',
      type: 'badge',
      formatter: (value: string) => this.formatSterilizationStatusLabel(value),
      badgeClass: (value: string) => value.toLowerCase()
    },
    {
      key: 'notes',
      header: 'Observações',
      type: 'notes'
    }
  ];

  readonly completedTableColumns: TableColumn[] = [
    {
      key: 'cat',
      header: 'Gato',
      type: 'cat-info'
    },
    {
      key: 'sterilizationDate',
      header: 'Data Realizada',
      type: 'date'
    },
    {
      key: 'status',
      header: 'Status',
      type: 'badge',
      formatter: (value: string) => this.formatSterilizationStatusLabel(value),
      badgeClass: () => 'completed'
    },
    {
      key: 'notes',
      header: 'Observações',
      type: 'notes'
    }
  ];

  constructor(
    private readonly sterilizationService: SterilizationService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.initializePagination();
  }

  ngOnInit(): void {
    // Reset pagination state to avoid infinite loading on subsequent visits
    this.resetPaginationState();
    // Reset loading states
    this.resetLoadingStates();
    // Cancel any pending requests from previous navigation
    this.destroy$.next();
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ===== INITIALIZATION =====

  /**
   * Initializes the component by loading all necessary data
   */
  private initializeComponent(): void {
    this.loadAllData();
  }

  /**
   * Initializes pagination with empty states
   */
  private initializePagination(): void {
    this.paginationState.scheduled.pagination = this.createEmptyPage<SterilizationDto>();
    this.paginationState.completed.pagination = this.createEmptyPage<SterilizationDto>();
  }

  /**
   * Resets pagination state to avoid infinite loading
   */
  private resetPaginationState(): void {
    this.paginationState.scheduled.currentPage = 0;
    this.paginationState.completed.currentPage = 0;
    this.initializePagination();
  }

  /**
   * Resets all loading states
   */
  private resetLoadingStates(): void {
    this.loadingCats = false;
    this.loadingSterilizations = false;
    this.loadingCompletedSterilizations = false;
    this.cdr.markForCheck();
  }

  /**
   * Creates an empty page object for pagination
   */
  private createEmptyPage<T>(): Page<T> {
    return {
      content: [],
      pageable: {
        sort: { empty: true, sorted: false, unsorted: true },
        offset: 0,
        pageSize: STERILIZATIONS_CONFIG.DEFAULT_PAGE_SIZE,
        pageNumber: 0,
        paged: true,
        unpaged: false
      },
      last: true,
      totalPages: 0,
      totalElements: 0,
      size: STERILIZATIONS_CONFIG.DEFAULT_PAGE_SIZE,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      first: true,
      numberOfElements: 0,
      empty: true
    };
  }

  // ===== DATA LOADING =====

  /**
   * Loads all data required for the component
   */
  loadAllData(): void {
    this.loadStats();
    this.loadCatsNeedingSterilization();
    this.loadScheduledSterilizations();
    this.loadCompletedSterilizations();
  }

  /**
   * Refreshes all component data
   */
  refreshData(): void {
    this.loadAllData();
  }

  /**
   * Loads sterilization statistics
   */
  private loadStats(): void {
    this.sterilizationService.getSterilizationStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Erro ao carregar estatísticas:', error);
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Loads cats that need sterilization
   */
  private loadCatsNeedingSterilization(): void {
    this.loadingCats = true;
    this.cdr.markForCheck();
    
    this.sterilizationService.getCatsNeedingSterilization()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingCats = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (cats) => {
          this.catsNeedingSterilization = cats;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Erro ao carregar gatos que precisam de castração:', error);
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Loads scheduled sterilizations with pagination
   */
  private loadScheduledSterilizations(): void {
    this.loadingSterilizations = true;
    this.cdr.markForCheck();
    
    const params = {
      page: this.paginationState.scheduled.currentPage,
      size: this.paginationState.scheduled.pageSize,
      sortBy: STERILIZATIONS_CONFIG.DEFAULT_SORT_SCHEDULED.field,
      sortDir: STERILIZATIONS_CONFIG.DEFAULT_SORT_SCHEDULED.direction
    };

    this.sterilizationService.getSterilizationsByStatus(SterilizationStatus.SCHEDULED, params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingSterilizations = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          this.paginationState.scheduled.pagination = response;
          this.scheduledSterilizations = response.content;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Erro ao carregar castrações agendadas:', error);
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Loads completed sterilizations with pagination
   */
  private loadCompletedSterilizations(): void {
    this.loadingCompletedSterilizations = true;
    this.cdr.markForCheck();
    
    const params = {
      page: this.paginationState.completed.currentPage,
      size: this.paginationState.completed.pageSize,
      sortBy: STERILIZATIONS_CONFIG.DEFAULT_SORT_COMPLETED.field,
      sortDir: STERILIZATIONS_CONFIG.DEFAULT_SORT_COMPLETED.direction
    };

    this.sterilizationService.getSterilizationsByStatus(SterilizationStatus.COMPLETED, params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingCompletedSterilizations = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          this.paginationState.completed.pagination = response;
          this.completedSterilizations = response.content;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Erro ao carregar castrações realizadas:', error);
          this.cdr.markForCheck();
        }
      });
  }

  // ===== UTILITY METHODS =====

  /**
   * Gets statistics data for display
   */
  getStatsData(): StatCardData[] {
    return [
      {
        number: this.stats?.eligibleCount || 0,
        label: 'Gatos Elegíveis',
        description: '90-179 dias de vida',
        icon: 'pi-calendar-plus',
        type: 'eligible'
      },
      {
        number: this.stats?.overdueCount || 0,
        label: 'Castrações Atrasadas',
        description: '180+ dias de vida',
        icon: 'pi-exclamation-triangle',
        type: 'overdue'
      }
    ];
  }

  // ===== FORMATTERS =====

  /**
   * Formats sex labels for display
   */
  private formatSexLabel(sex: string): string {
    return SEX_LABELS[sex as CatSex] || sex;
  }

  /**
   * Formats color labels for display
   */
  private formatColorLabel(color: string): string {
    return COLOR_LABELS[color as CatColor] || color;
  }

  /**
   * Formats sterilization status labels for display
   */
  private formatStatusLabel(status: string): string {
    return STERILIZATION_STATUS_TYPE_LABELS[status as SterilizationStatusType] || status;
  }

  /**
   * Formats sterilization status labels for display
   */
  private formatSterilizationStatusLabel(status: string): string {
    return STERILIZATION_STATUS_LABELS[status as SterilizationStatus] || status;
  }

  // ===== TABLE ACTION PROVIDERS =====

  /**
   * Provides action buttons for cats table
   */
  getCatsTableActions = (cat: CatSterilizationStatusDto): ActionButtonConfig[] => {
    return [
      {
        type: 'schedule',
        tooltip: `Agendar castração para ${cat.name}`
      }
    ];
  }

  /**
   * Provides action buttons for scheduled sterilizations table
   */
  getScheduledTableActions = (sterilization: SterilizationDto): ActionButtonConfig[] => {
    return [
      {
        type: 'edit',
        tooltip: 'Editar agendamento'
      },
      {
        type: 'complete',
        tooltip: 'Marcar como realizada'
      },
      {
        type: 'cancel',
        tooltip: 'Cancelar agendamento'
      }
    ];
  }

  // ===== EVENT HANDLERS =====

  /**
   * Handles table actions for cats
   */
  onCatsTableAction(event: { type: string; data: any }): void {
    if (event.type === 'schedule') {
      this.scheduleSterilization(event.data as CatSterilizationStatusDto);
    }
  }

  /**
   * Handles table actions for scheduled sterilizations
   */
  onScheduledTableAction(event: { type: string; data: any }): void {
    const sterilization = event.data as SterilizationDto;
    
    switch (event.type) {
      case 'edit':
        this.editSterilization(sterilization);
        break;
      case 'complete':
        this.completeSterilization(sterilization);
        break;
      case 'cancel':
        this.cancelSterilization(sterilization);
        break;
    }
  }

  // ===== PAGINATION GETTERS =====

  /**
   * Gets pagination info for scheduled sterilizations
   */
  getScheduledPaginationInfo(): PaginationInfo {
    const pagination = this.paginationState.scheduled.pagination;
    return {
      totalElements: pagination.totalElements,
      numberOfElements: pagination.numberOfElements,
      first: pagination.first,
      last: pagination.last,
      totalPages: pagination.totalPages,
      currentPage: this.paginationState.scheduled.currentPage
    };
  }

  /**
   * Gets pagination info for completed sterilizations
   */
  getCompletedPaginationInfo(): PaginationInfo {
    const pagination = this.paginationState.completed.pagination;
    return {
      totalElements: pagination.totalElements,
      numberOfElements: pagination.numberOfElements,
      first: pagination.first,
      last: pagination.last,
      totalPages: pagination.totalPages,
      currentPage: this.paginationState.completed.currentPage
    };
  }

  // ===== MODAL OPERATIONS =====

  /**
   * Opens modal to schedule sterilization for a cat
   */
  private scheduleSterilization(cat: CatSterilizationStatusDto): void {
    this.modalState.selectedCatForSchedule = cat;
    this.modalState.selectedSterilizationForEdit = null;
    this.modalState.scheduleModalVisible = true;
  }

  /**
   * Opens modal to edit sterilization
   */
  private editSterilization(sterilization: SterilizationDto): void {
    this.modalState.selectedSterilizationForEdit = sterilization;
    this.modalState.selectedCatForSchedule = null;
    this.modalState.scheduleModalVisible = true;
  }

  // ===== CONFIRMATION MODAL METHODS =====

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

  // ===== STERILIZATION OPERATIONS =====

  /**
   * Marks a sterilization as completed
   */
  private completeSterilization(sterilization: SterilizationDto): void {
    const config: ConfirmationConfig = {
      title: 'Confirmar Castração Realizada',
      message: `Confirma que a castração de ${sterilization.cat} foi realizada?`,
      confirmLabel: 'Sim, foi realizada',
      cancelLabel: 'Cancelar',
      icon: 'pi pi-check-circle',
      severity: 'success',
      details: [
        `Data agendada: ${new Date(sterilization.sterilizationDate).toLocaleString('pt-BR')}`,
        'Esta ação irá marcar a castração como concluída',
        'O gato será removido da lista de castrações agendadas'
      ]
    };

    this.showConfirmation(config, () => {
      const updatedSterilization: SterilizationRequest = {
        catId: sterilization.catId,
        sterilizationDate: sterilization.sterilizationDate,
        status: SterilizationStatus.COMPLETED,
        notes: sterilization.notes
      };

      this.updateSterilization(sterilization.id!, updatedSterilization, 'Castração marcada como realizada');
    });
  }

  /**
   * Cancels a sterilization
   */
  private cancelSterilization(sterilization: SterilizationDto): void {
    const config: ConfirmationConfig = {
      title: 'Cancelar Castração',
      message: `Confirma o cancelamento da castração de ${sterilization.cat}?`,
      confirmLabel: 'Sim, cancelar',
      cancelLabel: 'Não cancelar',
      icon: 'pi pi-times-circle',
      severity: 'danger',
      details: [
        `Data agendada: ${new Date(sterilization.sterilizationDate).toLocaleString('pt-BR')}`,
        'Esta ação irá cancelar definitivamente a castração',
        'O gato voltará para a lista de gatos que precisam de castração'
      ]
    };

    this.showConfirmation(config, () => {
      const updatedSterilization: SterilizationRequest = {
        catId: sterilization.catId,
        sterilizationDate: sterilization.sterilizationDate,
        status: SterilizationStatus.CANCELED,
        notes: sterilization.notes
      };

      this.updateSterilization(sterilization.id!, updatedSterilization, 'Castração cancelada');
    });
  }

  /**
   * Updates a sterilization record
   */
  private updateSterilization(id: string, data: SterilizationRequest, successMessage: string): void {
    this.sterilizationService.updateSterilization(id, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log(successMessage);
          this.loadAllData();
        },
        error: (error) => {
          console.error('Erro ao atualizar castração:', error);
        }
      });
  }

  // ===== PAGINATION METHODS - SCHEDULED =====

  /**
   * Goes to previous page for scheduled sterilizations
   */
  previousPage(): void {
    if (!this.paginationState.scheduled.pagination.first) {
      this.paginationState.scheduled.currentPage--;
      this.loadScheduledSterilizations();
    }
  }

  /**
   * Goes to next page for scheduled sterilizations
   */
  nextPage(): void {
    if (!this.paginationState.scheduled.pagination.last) {
      this.paginationState.scheduled.currentPage++;
      this.loadScheduledSterilizations();
    }
  }

  /**
   * Goes to specific page for scheduled sterilizations
   */
  goToPage(event: any): void {
    this.paginationState.scheduled.currentPage = parseInt(event.target.value);
    this.loadScheduledSterilizations();
  }

  // ===== PAGINATION METHODS - COMPLETED =====

  /**
   * Goes to previous page for completed sterilizations
   */
  previousCompletedPage(): void {
    if (!this.paginationState.completed.pagination.first) {
      this.paginationState.completed.currentPage--;
      this.loadCompletedSterilizations();
    }
  }

  /**
   * Goes to next page for completed sterilizations
   */
  nextCompletedPage(): void {
    if (!this.paginationState.completed.pagination.last) {
      this.paginationState.completed.currentPage++;
      this.loadCompletedSterilizations();
    }
  }

  /**
   * Goes to specific page for completed sterilizations
   */
  goToCompletedPage(event: any): void {
    this.paginationState.completed.currentPage = parseInt(event.target.value);
    this.loadCompletedSterilizations();
  }

  // ===== MODAL EVENT HANDLERS =====

  /**
   * Handles sterilization scheduled event
   */
  onSterilizationScheduled(): void {
    this.loadAllData();
    this.closeScheduleModal();
  }

  /**
   * Handles sterilization updated event
   */
  onSterilizationUpdated(): void {
    this.loadAllData();
    this.closeScheduleModal();
  }

  /**
   * Handles schedule modal hide event
   */
  onScheduleModalHide(): void {
    this.closeScheduleModal();
  }

  /**
   * Closes schedule modal and resets state
   */
  private closeScheduleModal(): void {
    this.modalState.scheduleModalVisible = false;
    this.modalState.selectedCatForSchedule = null;
    this.modalState.selectedSterilizationForEdit = null;
  }

  // ===== TEMPLATE GETTERS FOR EASIER ACCESS =====

  get scheduleModalVisible(): boolean {
    return this.modalState.scheduleModalVisible;
  }

  set scheduleModalVisible(value: boolean) {
    this.modalState.scheduleModalVisible = value;
  }

  get selectedCatForSchedule(): CatSterilizationStatusDto | null {
    return this.modalState.selectedCatForSchedule;
  }

  get selectedSterilizationForEdit(): SterilizationDto | null {
    return this.modalState.selectedSterilizationForEdit;
  }



  get catsEmptyState(): TableEmptyState {
    return this.emptyStates.cats;
  }

  get scheduledEmptyState(): TableEmptyState {
    return this.emptyStates.scheduled;
  }

  get completedEmptyState(): TableEmptyState {
    return this.emptyStates.completed;
  }
}
