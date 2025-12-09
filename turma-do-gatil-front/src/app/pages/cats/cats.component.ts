import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, finalize } from 'rxjs';

// Services
import { CatService } from '../../services/cat.service';
import { CatDisplayService } from './services/cat-display.service';
import { CatFiltersService } from './services/cat-filters.service';
import { CatStatsService } from './services/cat-stats.service';

// Models & Interfaces
import { Cat, CatFilters, Page, CatAdoptionStatus } from '../../models/cat.model';
import { 
  DialogsState, 
  LoadingState, 
  PaginationConfig,
  FilterOption,
  CatDisplayInfo
} from './models/cats-view.interface';

// Constants
import { 
  COLOR_OPTIONS,
  SEX_OPTIONS,
  ADOPTION_STATUS_OPTIONS,
  SORT_OPTIONS,
  PAGE_SIZE_OPTIONS,
  BUTTON_CONFIGS,
  CATS_CONFIG
} from './constants/cats.constants';

// Components
import { CatDetailsModalComponent } from './cat-details-modal/cat-details-modal.component';
import { CatCreateModalComponent } from './cat-create-modal/cat-create-modal.component';
import { 
  PageHeaderComponent,
  StatsGridComponent, 
  StatCardData,
  ContentCardComponent,
  GenericModalComponent,
  ModalAction,
  GenericButtonComponent,
  GenericButtonConfig,
  PaginationComponent,
  PaginationInfo
} from '../../shared/components';

@Component({
  selector: 'app-cats',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    Select,
    TagModule,
    SkeletonModule,
    TooltipModule,
    ImageModule,
    DialogModule,
    ToastModule,
    CatDetailsModalComponent,
    CatCreateModalComponent,
    // Componentes genéricos
    PageHeaderComponent,
    StatsGridComponent,
    ContentCardComponent,
    GenericModalComponent,
    GenericButtonComponent,
    PaginationComponent
  ],
  providers: [MessageService],
  templateUrl: './cats.component.html',
  styleUrl: './cats.component.css'
  // changeDetection: ChangeDetectionStrategy.OnPush // Temporariamente removido para resolver problema de loading
})
export class CatsComponent implements OnInit, OnDestroy {
  
  //#region Private Properties
  private readonly destroy$ = new Subject<void>();
  //#endregion

  //#region Public Properties - Data
  cats: Cat[] = [];
  catsDisplay: CatDisplayInfo[] = [];
  totalRecords = 0;
  statsData: StatCardData[] = [];
  //#endregion

  //#region Public Properties - Pagination
  first = 0;
  readonly rows = CATS_CONFIG.DEFAULT_PAGE_SIZE;
  paginationInfo: PaginationInfo = {
    totalElements: 0,
    numberOfElements: 0,
    first: true,
    last: false,
    totalPages: 0,
    currentPage: 0
  };
  //#endregion

  //#region Public Properties - State Management
  loadingState: LoadingState = { isLoading: false, deleting: false };
  
  dialogsState: DialogsState = {
    catDetails: { visible: false, cat: null },
    catCreateEdit: { visible: false, cat: null },
    deleteConfirm: { visible: false, cat: null }
  };

  paginationConfig: PaginationConfig = {
    currentPage: 0,
    pageSize: CATS_CONFIG.DEFAULT_PAGE_SIZE,
    totalRecords: 0,
    pageSizeOptions: PAGE_SIZE_OPTIONS
  };
  //#endregion

  //#region Public Properties - Options for Dropdowns
  readonly colorOptions: FilterOption[] = COLOR_OPTIONS;
  readonly sexOptions: FilterOption[] = SEX_OPTIONS;
  readonly adoptionStatusOptions: FilterOption[] = ADOPTION_STATUS_OPTIONS;
  readonly sortOptions: FilterOption[] = SORT_OPTIONS;
  readonly pageSizeOptions: FilterOption<number>[] = PAGE_SIZE_OPTIONS;
  //#endregion

  //#region Public Properties - Computed Values
  
  // Expose Math for template usage
  readonly Math = Math;



  /**
   * Ações para o modal de confirmação de exclusão
   */
  get deleteModalActions(): ModalAction[] {
    return [
      {
        label: 'Cancelar',
        icon: 'pi-times',
        severity: 'secondary',
        outlined: true,
        action: () => this.cancelDelete()
      },
      {
        label: 'Sim, excluir',
        icon: 'pi-trash',
        severity: 'danger',
        action: () => this.confirmDelete()
      }
    ];
  }

  /**
   * Configurações dos botões genéricos
   */
  get buttonConfigs() {
    return {
      newCat: BUTTON_CONFIGS.NEW_CAT,
      clearFilters: BUTTON_CONFIGS.CLEAR_FILTERS,
      clearFiltersEmpty: BUTTON_CONFIGS.CLEAR_FILTERS_EMPTY
    };
  }
  //#endregion

  //#region Constructor and Lifecycle
  constructor(
    private readonly catService: CatService,
    private readonly messageService: MessageService,
    private readonly catDisplayService: CatDisplayService,
    private readonly catFiltersService: CatFiltersService,
    private readonly catStatsService: CatStatsService
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

  //#region Initialization
  /**
   * Inicializa o componente configurando listeners e carregando dados
   */
  private initializeComponent(): void {
    this.setupFilterSubscription();
    this.loadCats();
    this.loadStats();
  }

  /**
   * Configura a subscription para mudanças nos filtros
   */
  private setupFilterSubscription(): void {
    this.catFiltersService.filters$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filters => {
        this.updatePaginationFromFilters(filters);
      });
  }

  /**
   * Atualiza a configuração de paginação baseada nos filtros
   */
  private updatePaginationFromFilters(filters: CatFilters): void {
    this.paginationConfig = {
      ...this.paginationConfig,
      currentPage: filters.page || 0,
      pageSize: filters.size || CATS_CONFIG.DEFAULT_PAGE_SIZE
    };
  }
  //#endregion

  //#region Data Loading

  /**
   * Carrega a lista de gatos baseada nos filtros atuais
   */
  loadCats(): void {
    this.setLoadingState(true);
    
    // Calcula a página atual baseado no first
    const currentPage = Math.floor(this.first / this.rows);
    
    // Atualiza o filtro de página antes de pegar os filtros
    this.catFiltersService.updatePage(currentPage);
    
    const cleanFilters = this.catFiltersService.getCleanFiltersForApi();

    this.catService.getAllCats(cleanFilters)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState(false))
      )
      .subscribe({
        next: (response: Page<Cat>) => this.handleCatsLoaded(response),
        error: (error) => this.handleLoadError(error)
      });
  }

  /**
   * Carrega as estatísticas dos gatos
   */
  loadStats(): void {
    this.catStatsService.getCatStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => this.statsData = stats,
        error: (error) => this.handleStatsError(error)
      });
  }

  /**
   * Manipula o sucesso do carregamento dos gatos
   */
  private handleCatsLoaded(response: Page<Cat>): void {
    this.cats = response.content;
    this.catsDisplay = this.catDisplayService.transformCatsToDisplayInfo(response.content);
    this.totalRecords = response.totalElements;
    // Atualiza o first baseado na página retornada pela API
    this.first = response.number * this.rows;
    this.paginationConfig = {
      ...this.paginationConfig,
      currentPage: response.number,
      totalRecords: response.totalElements
    };
    // Atualiza a propriedade paginationInfo com uma nova referência
    this.updatePaginationInfo();
  }

  /**
   * Manipula erros no carregamento dos gatos
   */
  private handleLoadError(error: any): void {
    console.error('Erro ao carregar gatos:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Ocorreu um erro ao carregar os gatos. Tente novamente.'
    });
  }

  /**
   * Manipula erros no carregamento das estatísticas
   */
  private handleStatsError(error: any): void {
    console.error('Erro ao carregar estatísticas:', error);
    // Não mostra erro para o usuário pois as estatísticas são secundárias
    // Define valores padrão
    this.statsData = [
      { number: 0, label: 'Disponíveis', description: 'Gatos prontos para adoção', icon: 'pi-heart', type: 'success' },
      { number: 0, label: 'Adotados', description: 'Gatos que encontraram um lar', icon: 'pi-home', type: 'warning' },
      { number: 0, label: 'Total', description: 'Total de gatos cadastrados', icon: 'pi-tag', type: 'primary' }
    ];
  }

  /**
   * Define o estado de loading
   */
  private setLoadingState(isLoading: boolean, error?: string): void {
    this.loadingState = { isLoading, deleting: this.loadingState.deleting, error };
  }
  //#endregion

  //#region Filter Management

  /**
   * Retorna os filtros atuais
   */
  getCurrentFilters(): CatFilters {
    return this.catFiltersService.getCurrentFilters();
  }

  /**
   * Manipula mudanças nos filtros
   */
  onFilterChange(): void {
    this.first = 0;
    this.catFiltersService.resetPage();
    this.loadCats();
  }

  /**
   * Manipula mudanças na ordenação
   */
  onSortChange(): void {
    this.first = 0;
    const currentFilters = this.getCurrentFilters();
    const { sortBy, sortDir } = this.catFiltersService.processSortValue(currentFilters.sortBy || '');
    
    this.catFiltersService.updateSort(sortBy, sortDir);
    this.loadCats();
  }

  /**
   * Limpa todos os filtros
   */
  clearFilters(): void {
    this.first = 0;
    this.catFiltersService.clearFilters();
    this.loadCats();
  }

  /**
   * Verifica se há filtros ativos
   */
  hasActiveFilters(): boolean {
    return this.catFiltersService.hasActiveFilters();
  }
  //#endregion

  //#region Pagination Management

  /**
   * Atualiza as informações de paginação
   */
  private updatePaginationInfo(): void {
    this.paginationInfo = {
      totalElements: this.totalRecords,
      numberOfElements: this.cats.length,
      first: this.first === 0,
      last: this.first + this.rows >= this.totalRecords,
      totalPages: Math.ceil(this.totalRecords / this.rows),
      currentPage: Math.floor(this.first / this.rows)
    };
  }

  /**
   * Obtém informações da paginação atual (compatibilidade)
   */
  getPaginationInfo(): PaginationInfo {
    return this.paginationInfo;
  }

  /**
   * Navega para página anterior
   */
  previousPage(): void {
    if (this.first > 0) {
      this.first = Math.max(0, this.first - this.rows);
      this.loadCats();
    }
  }

  /**
   * Navega para próxima página
   */
  nextPage(): void {
    if (this.first + this.rows < this.totalRecords) {
      this.first = this.first + this.rows;
      this.loadCats();
    }
  }

  /**
   * Navega para página específica
   */
  goToPage(event: any): void {
    const page = parseInt(event.target.value);
    this.first = page * this.rows;
    this.loadCats();
  }

  //#endregion

  //#region Dialog Management

  /**
   * Abre o diálogo para adicionar novo gato
   */
  openAddCatDialog(): void {
    this.dialogsState.catCreateEdit = { visible: true, cat: null };
  }

  /**
   * Visualiza detalhes de um gato
   */
  viewCatDetails(cat: Cat): void {
    this.dialogsState.catDetails = { visible: true, cat };
  }

  /**
   * Edita um gato
   */
  editCat(cat: Cat): void {
    this.dialogsState.catCreateEdit = { visible: true, cat };
    this.dialogsState.catDetails = { visible: false, cat: null };
  }

  /**
   * Inicia processo de exclusão de um gato
   */
  deleteCat(cat: Cat): void {
    this.dialogsState.deleteConfirm = { visible: true, cat };
  }

  /**
   * Cancela a exclusão de um gato
   */
  cancelDelete(): void {
    this.dialogsState.deleteConfirm = { visible: false, cat: null };
  }

  /**
   * Confirma a exclusão de um gato
   */
  confirmDelete(): void {
    const catToDelete = this.dialogsState.deleteConfirm.cat;
    if (!catToDelete) return;

    // Proteção contra cliques múltiplos
    if (this.loadingState.deleting) return;
    this.loadingState.deleting = true;

    this.catService.deleteCat(catToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadingState.deleting = false;
          this.handleDeleteSuccess(catToDelete);
        },
        error: (error) => {
          this.loadingState.deleting = false;
          this.handleDeleteError(error);
        }
      });
  }

  /**
   * Manipula sucesso na exclusão
   */
  private handleDeleteSuccess(deletedCat: Cat): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `O gato "${deletedCat.name}" foi excluído com sucesso.`
    });
    this.closeAllDialogs();
    this.loadCats();
    this.loadStats(); // Recarrega as estatísticas
  }

  /**
   * Manipula erro na exclusão
   */
  private handleDeleteError(error: any): void {
    console.error('Erro ao deletar gato:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Ocorreu um erro ao tentar excluir o gato. Tente novamente.'
    });
    this.dialogsState.deleteConfirm = { visible: false, cat: null };
  }

  /**
   * Fecha todos os diálogos
   */
  private closeAllDialogs(): void {
    this.dialogsState = {
      catDetails: { visible: false, cat: null },
      catCreateEdit: { visible: false, cat: null },
      deleteConfirm: { visible: false, cat: null }
    };
  }
  //#endregion

  //#region Event Handlers

  /**
   * Manipula o sucesso na criação de um gato
   */
  onCatCreated(): void {
    this.dialogsState.catCreateEdit = { visible: false, cat: null };
    this.loadCats();
    this.loadStats(); // Recarrega as estatísticas
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Gato cadastrado com sucesso!'
    });
  }

  /**
   * Manipula o sucesso na atualização de um gato
   */
  onCatUpdated(): void {
    this.dialogsState.catCreateEdit = { visible: false, cat: null };
    this.loadCats();
    this.loadStats(); // Recarrega as estatísticas
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Gato atualizado com sucesso!'
    });
  }

  /**
   * Manipula a adoção de um gato
   */
  adoptCat(cat: Cat): void {
    this.dialogsState.catDetails = { visible: false, cat: null };
    this.loadCats();
    this.loadStats(); // Recarrega as estatísticas
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `A adoção do gato "${cat.name}" foi registrada com sucesso!`
    });
  }

  /**
   * Manipula erro no carregamento de imagem
   */
  onImageError(event: any): void {
    event.target.src = this.catDisplayService.getDefaultImageUrl();
  }
  //#endregion

  //#region Utility Methods

  /**
   * TrackBy function para otimizar *ngFor dos gatos
   */
  trackByCatId(index: number, cat: Cat): string {
    return cat.id;
  }

  /**
   * TrackBy function para arrays de índices
   */
  trackByIndex(index: number, item: any): number {
    return index;
  }

  /**
   * Gera array para skeleton loading
   */
  getSkeletonArray(): number[] {
    return Array.from({ length: CATS_CONFIG.SKELETON_ITEMS_COUNT }, (_, i) => i);
  }
  //#endregion

  //#region Template Helper Methods

  /**
   * Formata uma data para exibição
   */
  formatDate(dateString: string): string {
    return this.catDisplayService.formatDate(dateString);
  }

  /**
   * Calcula a idade de um gato
   */
  getAge(birthDate?: string): string {
    return this.catDisplayService.calculateAge(birthDate);
  }

  /**
   * Retorna o label de uma cor
   */
  getColorLabel(color: string): string {
    return this.catDisplayService.getColorLabel(color as any);
  }

  /**
   * Retorna o label de um sexo
   */
  getSexLabel(sex: string): string {
    return this.catDisplayService.getSexLabel(sex as any);
  }

  /**
   * Retorna informações de display do status de adoção
   */
  getAdoptionStatusText(status: CatAdoptionStatus): string {
    return this.catDisplayService.getAdoptionStatusInfo(status).text;
  }

  getAdoptionStatusIcon(status: CatAdoptionStatus): string {
    return this.catDisplayService.getAdoptionStatusInfo(status).icon;
  }

  getAdoptionStatusClass(status: CatAdoptionStatus): string {
    return this.catDisplayService.getAdoptionStatusInfo(status).cssClass;
  }

  /**
   * Retorna a URL da imagem padrão
   */
  getDefaultImage(): string {
    return this.catDisplayService.getDefaultImageUrl();
  }

  //#endregion

  //#region Legacy Property Getters (for template compatibility)
  
  // Mantendo compatibilidade com template durante refatoração
  get loading(): boolean {
    return this.loadingState.isLoading;
  }

  get currentPage(): number {
    return this.paginationConfig.currentPage;
  }

  get pageSize(): number {
    return this.paginationConfig.pageSize;
  }

  set pageSize(value: number) {
    this.paginationConfig.pageSize = value;
  }

  get catDetailsDialog(): boolean {
    return this.dialogsState.catDetails.visible;
  }

  set catDetailsDialog(value: boolean) {
    this.dialogsState.catDetails.visible = value;
  }

  get selectedCat(): Cat | null {
    return this.dialogsState.catDetails.cat;
  }

  get catCreateDialog(): boolean {
    return this.dialogsState.catCreateEdit.visible;
  }

  set catCreateDialog(value: boolean) {
    this.dialogsState.catCreateEdit.visible = value;
  }

  get catToEdit(): Cat | null {
    return this.dialogsState.catCreateEdit.cat;
  }

  get deleteConfirmDialog(): boolean {
    return this.dialogsState.deleteConfirm.visible;
  }

  set deleteConfirmDialog(value: boolean) {
    this.dialogsState.deleteConfirm.visible = value;
  }

  get catToDelete(): Cat | null {
    return this.dialogsState.deleteConfirm.cat;
  }

  get filters(): CatFilters {
    return this.getCurrentFilters();
  }

  set filters(value: CatFilters) {
    this.catFiltersService.updateFilters(value);
  }

  // Configurações dos botões para compatibilidade com template
  get newCatButtonConfig() {
    return this.buttonConfigs.newCat;
  }

  get clearFiltersButtonConfig() {
    return this.buttonConfigs.clearFilters;
  }

  get clearFiltersEmptyButtonConfig() {
    return this.buttonConfigs.clearFiltersEmpty;
  }

  //#endregion
}
