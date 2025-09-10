import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
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
  TableEmptyState
} from '../../shared/components';

/**
 * Constants and Enums
 */
enum SterilizationStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

enum CatColor {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
  GRAY = 'GRAY',
  ORANGE = 'ORANGE',
  BROWN = 'BROWN',
  MIXED = 'MIXED',
  OTHER = 'OTHER'
}

enum CatSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

enum SterilizationStatusType {
  ELIGIBLE = 'ELIGIBLE',
  OVERDUE = 'OVERDUE'
}

interface SterilizationTableAction {
  type: 'schedule' | 'edit' | 'complete' | 'cancel';
  data: CatSterilizationStatusDto | SterilizationDto;
}

/**
 * Configuration constants
 */
const PAGE_SIZE = 10;
const TABLE_CONFIG = {
  CAT_PHOTO_WIDTH: '80px',
  DEFAULT_SORT_SCHEDULED: { field: 'sterilizationDate', direction: 'asc' as const },
  DEFAULT_SORT_COMPLETED: { field: 'sterilizationDate', direction: 'desc' as const }
} as const;

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, 
    SterilizationScheduleModalComponent,
    RefreshButtonComponent,
    PaginationComponent,
    StatsGridComponent,
    ContentCardComponent,
    PageHeaderComponent,
    DataTableComponent
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
  readonly loadingStates = {
    cats: false,
    sterilizations: false,
    completedSterilizations: false
  };
  
  // ===== MODAL STATE =====
  readonly modalState = {
    scheduleModalVisible: false,
    selectedCatForSchedule: null as CatSterilizationStatusDto | null,
    selectedSterilizationForEdit: null as SterilizationDto | null
  };
  
  // ===== PAGINATION STATE =====
  readonly paginationState = {
    scheduled: {
      currentPage: 0,
      pageSize: PAGE_SIZE,
      pagination: {} as Page<SterilizationDto>
    },
    completed: {
      currentPage: 0,
      pageSize: PAGE_SIZE,
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
      width: TABLE_CONFIG.CAT_PHOTO_WIDTH,
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

  constructor(private readonly sterilizationService: SterilizationService) {
    this.initializePagination();
  }

  ngOnInit(): void {
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
   * Creates an empty page object for pagination
   */
  private createEmptyPage<T>(): Page<T> {
    return {
      content: [],
      pageable: {
        sort: { empty: true, sorted: false, unsorted: true },
        offset: 0,
        pageSize: PAGE_SIZE,
        pageNumber: 0,
        paged: true,
        unpaged: false
      },
      last: true,
      totalPages: 0,
      totalElements: 0,
      size: PAGE_SIZE,
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
        },
        error: (error) => {
          console.error('Erro ao carregar estatísticas:', error);
        }
      });
  }

  /**
   * Loads cats that need sterilization
   */
  private loadCatsNeedingSterilization(): void {
    this.setLoadingState('cats', true);
    
    this.sterilizationService.getCatsNeedingSterilization()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState('cats', false))
      )
      .subscribe({
        next: (cats) => {
          this.catsNeedingSterilization = cats;
        },
        error: (error) => {
          console.error('Erro ao carregar gatos que precisam de castração:', error);
        }
      });
  }

  /**
   * Loads scheduled sterilizations with pagination
   */
  private loadScheduledSterilizations(): void {
    this.setLoadingState('sterilizations', true);
    
    const params = {
      page: this.paginationState.scheduled.currentPage,
      size: this.paginationState.scheduled.pageSize,
      sortBy: TABLE_CONFIG.DEFAULT_SORT_SCHEDULED.field,
      sortDir: TABLE_CONFIG.DEFAULT_SORT_SCHEDULED.direction
    };

    this.sterilizationService.getSterilizationsByStatus(SterilizationStatus.SCHEDULED, params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState('sterilizations', false))
      )
      .subscribe({
        next: (response) => {
          this.paginationState.scheduled.pagination = response;
          this.scheduledSterilizations = response.content;
        },
        error: (error) => {
          console.error('Erro ao carregar castrações agendadas:', error);
        }
      });
  }

  /**
   * Loads completed sterilizations with pagination
   */
  private loadCompletedSterilizations(): void {
    this.setLoadingState('completedSterilizations', true);
    
    const params = {
      page: this.paginationState.completed.currentPage,
      size: this.paginationState.completed.pageSize,
      sortBy: TABLE_CONFIG.DEFAULT_SORT_COMPLETED.field,
      sortDir: TABLE_CONFIG.DEFAULT_SORT_COMPLETED.direction
    };

    this.sterilizationService.getSterilizationsByStatus(SterilizationStatus.COMPLETED, params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState('completedSterilizations', false))
      )
      .subscribe({
        next: (response) => {
          this.paginationState.completed.pagination = response;
          this.completedSterilizations = response.content;
        },
        error: (error) => {
          console.error('Erro ao carregar castrações realizadas:', error);
        }
      });
  }

  // ===== UTILITY METHODS =====

  /**
   * Sets loading state for a specific operation
   */
  private setLoadingState(key: keyof typeof this.loadingStates, value: boolean): void {
    this.loadingStates[key] = value;
  }

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
    const sexLabels: Record<CatSex, string> = {
      [CatSex.MALE]: 'Macho',
      [CatSex.FEMALE]: 'Fêmea'
    };
    return sexLabels[sex as CatSex] || sex;
  }

  /**
   * Formats color labels for display
   */
  private formatColorLabel(color: string): string {
    const colorLabels: Record<CatColor, string> = {
      [CatColor.WHITE]: 'Branco',
      [CatColor.BLACK]: 'Preto',
      [CatColor.GRAY]: 'Cinza',
      [CatColor.ORANGE]: 'Laranja',
      [CatColor.BROWN]: 'Marrom',
      [CatColor.MIXED]: 'Misto',
      [CatColor.OTHER]: 'Outro'
    };
    return colorLabels[color as CatColor] || color;
  }

  /**
   * Formats sterilization status labels for display
   */
  private formatStatusLabel(status: string): string {
    const statusLabels: Record<SterilizationStatusType, string> = {
      [SterilizationStatusType.ELIGIBLE]: 'Elegível',
      [SterilizationStatusType.OVERDUE]: 'Atrasada'
    };
    return statusLabels[status as SterilizationStatusType] || status;
  }

  /**
   * Formats sterilization status labels for display
   */
  private formatSterilizationStatusLabel(status: string): string {
    const statusLabels: Record<SterilizationStatus, string> = {
      [SterilizationStatus.SCHEDULED]: 'Agendada',
      [SterilizationStatus.COMPLETED]: 'Realizada',
      [SterilizationStatus.CANCELED]: 'Cancelada'
    };
    return statusLabels[status as SterilizationStatus] || status;
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
  onCatsTableAction(event: SterilizationTableAction): void {
    if (event.type === 'schedule') {
      this.scheduleSterilization(event.data as CatSterilizationStatusDto);
    }
  }

  /**
   * Handles table actions for scheduled sterilizations
   */
  onScheduledTableAction(event: SterilizationTableAction): void {
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

  // ===== STERILIZATION OPERATIONS =====

  /**
   * Marks a sterilization as completed
   */
  private completeSterilization(sterilization: SterilizationDto): void {
    const confirmMessage = `Confirma que a castração de ${sterilization.cat} foi realizada?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    const updatedSterilization: SterilizationRequest = {
      catId: sterilization.catId,
      sterilizationDate: sterilization.sterilizationDate,
      status: SterilizationStatus.COMPLETED,
      notes: sterilization.notes
    };

    this.updateSterilization(sterilization.id!, updatedSterilization, 'Castração marcada como realizada');
  }

  /**
   * Cancels a sterilization
   */
  private cancelSterilization(sterilization: SterilizationDto): void {
    const confirmMessage = `Confirma o cancelamento da castração de ${sterilization.cat}?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    const updatedSterilization: SterilizationRequest = {
      catId: sterilization.catId,
      sterilizationDate: sterilization.sterilizationDate,
      status: SterilizationStatus.CANCELED,
      notes: sterilization.notes
    };

    this.updateSterilization(sterilization.id!, updatedSterilization, 'Castração cancelada');
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

  get loadingCats(): boolean {
    return this.loadingStates.cats;
  }

  get loadingSterilizations(): boolean {
    return this.loadingStates.sterilizations;
  }

  get loadingCompletedSterilizations(): boolean {
    return this.loadingStates.completedSterilizations;
  }

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
