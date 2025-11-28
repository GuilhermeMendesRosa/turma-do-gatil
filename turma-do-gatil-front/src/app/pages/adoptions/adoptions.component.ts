import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, forkJoin, EMPTY, Observable, of } from 'rxjs';
import { takeUntil, catchError, finalize, switchMap } from 'rxjs/operators';

// Services
import { AdoptionService } from '../../services/adoption.service';
import { AdopterService } from '../../services/adopter.service';
import { CatService } from '../../services/cat.service';
import { AdoptionUtilsService } from './services/adoption-utils.service';
import { UploadService } from '../../services/upload.service';
import { NotificationService } from '../../services/notification.service';
import { FormattingUtilsService } from '../../shared/services/formatting-utils.service';

// Models
import { Adoption, AdoptionStatus, Page, AdoptionRequest } from '../../models/adoption.model';
import { Adopter } from '../../models/adopter.model';
import { Cat } from '../../models/cat.model';

// Interface estendida para exibição na tabela
interface AdoptionDisplay extends Adoption {
  catPhoto?: string;
  catName?: string;
  adopterName?: string;
}

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
  // changeDetection: ChangeDetectionStrategy.OnPush, // Temporariamente removido para resolver problema de loading
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
  adoptions: AdoptionDisplay[] = [];
  
  /** Total de registros para paginação */
  totalRecords: number = 0;
  
  /** Estado de carregamento da lista */
  loading: boolean = false;
  
  /** Estado de carregamento do modal */
  modalLoading: boolean = false;
  
  /** Estado de carregamento de dados relacionados */
  loadingRelatedData: boolean = false;
  
  /** Controle de visibilidade do modal */
  showStatusModal: boolean = false;
  
  /** Adoção selecionada para edição */
  selectedAdoption: Adoption | null = null;
  
  /** Status selecionado no modal */
  selectedStatus: AdoptionStatus | '' = '';
  
  /** Arquivo selecionado para upload do termo */
  selectedFile: File | null = null;
  
  /** URL de preview da imagem do termo */
  previewUrl: string | null = null;
  
  /** Flag indicando se a foto foi removida pelo usuário */
  photoRemoved: boolean = false;
  
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
    private readonly uploadService: UploadService,
    private readonly notificationService: NotificationService,
    private readonly formattingUtils: FormattingUtilsService,
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
      (date: string) => this.formattingUtils.formatDate(date),
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
    this.loadingRelatedData = true;
    
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
          this.adoptions = response.content.map(adoption => ({
            ...adoption,
            catPhoto: undefined,
            catName: undefined,
            adopterName: undefined
          }));
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

    // Verifica se há dados para carregar
    const hasDataToLoad = adopterIds.some(id => !this.adoptersMap.has(id)) || 
                         catIds.some(id => !this.catsMap.has(id));

    if (hasDataToLoad) {
      this.loadingRelatedData = true;
      this.cdr.markForCheck();
    } else {
      // Se todos os dados já estão no cache, enriquece imediatamente
      this.enrichAdoptionData();
      this.loadingRelatedData = false;
      this.cdr.markForCheck();
    }

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
          this.enrichAdoptionData();
          this.checkRelatedDataLoadingComplete();
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
          this.enrichAdoptionData();
          this.checkRelatedDataLoadingComplete();
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
    this.previewUrl = adoption.adoptionTermPhoto || null;
    this.photoRemoved = false;
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
    this.selectedFile = null;
    this.previewUrl = null;
    this.photoRemoved = false;
    this.modalLoading = false;
    this.cdr.markForCheck();
  }

  /**
   * Salva a alteração de status da adoção
   */
  private saveStatusChange(): void {
    if (!this.selectedAdoption || this.modalLoading) {
      return;
    }

    // Verificar se houve mudança de status
    const statusChanged = this.selectedStatus !== this.selectedAdoption.status;
    
    // Verificar se houve mudança na foto
    const photoChanged = this.selectedFile !== null || this.photoRemoved;

    // Se não houve mudança de status nem de foto, não fazer nada
    if (!statusChanged && !photoChanged) {
      this.hideModal();
      return;
    }

    // Se houve mudança de status, validar transição
    if (statusChanged && this.selectedStatus && !this.adoptionUtils.isValidStatusTransition(
      this.selectedAdoption.status, 
      this.selectedStatus
    )) {
      console.warn('Transição de status inválida');
      return;
    }

    this.modalLoading = true;
    this.cdr.markForCheck();

    this.handleImageUpload()
      .pipe(
        switchMap(photoUrl => this.updateAdoptionStatus(photoUrl)),
        catchError(error => {
          console.error('Erro ao atualizar adoção:', error);
          this.modalLoading = false;
          this.cdr.markForCheck();
          return EMPTY;
        }),
        finalize(() => {
          this.modalLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.hideModal();
          this.loadAdoptionsData();
        }
      });
  }

  /**
   * Gerencia o upload da imagem do termo se houver arquivo selecionado
   * @returns Observable com a URL da foto
   */
  private handleImageUpload(): Observable<string> {
    if (this.selectedFile) {
      return this.uploadService.uploadImage(this.selectedFile).pipe(
        switchMap(response => {
          console.log('Upload bem-sucedido:', response);
          const photoUrl = response.fileUrl || '';
          return of(photoUrl);
        }),
        catchError(error => {
          this.notificationService.showError(
            'Erro no Upload',
            'Não foi possível fazer upload da imagem do termo. Tente novamente.'
          );
          return of('');
        })
      );
    }

    // Se a foto foi removida, retornar string vazia
    if (this.photoRemoved) {
      return of('');
    }

    // Se não tem arquivo selecionado e não foi removida, usar foto existente
    const existingPhotoUrl = this.selectedAdoption?.adoptionTermPhoto || '';
    return of(existingPhotoUrl);
  }

  /**
   * Atualiza o status da adoção com a URL da foto do termo
   * @param photoUrl URL da foto do termo
   * @returns Observable que completa após a atualização
   */
  private updateAdoptionStatus(photoUrl: string): Observable<void> {
    console.log('Atualizando adoção com status:', this.selectedStatus, 'e foto:', photoUrl);
    const updateRequest: AdoptionRequest = {
      catId: this.selectedAdoption!.catId,
      adopterId: this.selectedAdoption!.adopterId,
      adoptionDate: this.selectedAdoption!.adoptionDate,
      status: this.selectedStatus as AdoptionStatus,
      adoptionTermPhoto: photoUrl
    };

    console.log('Requisição de atualização:', updateRequest);
    return this.adoptionService.updateAdoption(this.selectedAdoption!.id, updateRequest).pipe(
      switchMap(() => of(void 0))
    );
  }

  // ==================== MÉTODOS PÚBLICOS PARA TEMPLATE ====================

  /**
   * Exibe o nome do gato para o template
   */
  displayCatName(catId: string | undefined): string {
    return this.getCatName(catId);
  }

  /**
   * Exibe o nome do adotante para o template
   */
  displayAdopterName(adopterId: string | undefined): string {
    return this.getAdopterName(adopterId);
  }

  /**
   * Exibe a data formatada para o template
   */
  displayFormattedDate(dateString: string | undefined): string {
    return this.formattingUtils.formatDate(dateString);
  }

  /**
   * Exibe a foto do gato para o template
   */
  displayCatPhoto(catId: string | undefined): string {
    return this.getCatPhoto(catId);
  }

  /**
   * TrackBy function para opções de status
   */
  trackByStatusValue(index: number, option: any): any {
    return option.value;
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

  /**
   * Obtém a foto do gato pelo ID
   */
  private getCatPhoto(catId: string | undefined): string {
    if (!catId) return '/assets/images/default-cat.svg';
    const cat = this.catsMap.get(catId);
    return cat?.photoUrl || '/assets/images/default-cat.svg';
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
   * @deprecated Use formattingUtils.formatDate() instead
   */
  formatDate(dateString: string | undefined): string {
    return this.formattingUtils.formatDate(dateString);
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

  /**
   * Enriquece os dados das adoções com informações dos gatos e adotantes
   */
  private enrichAdoptionData(): void {
    this.adoptions = this.adoptions.map(adoption => ({
      ...adoption,
      catPhoto: this.getCatPhoto(adoption.catId),
      catName: this.getCatName(adoption.catId),
      adopterName: this.getAdopterName(adoption.adopterId)
    }));
  }

  /**
   * Verifica se o carregamento de dados relacionados foi completado
   */
  private checkRelatedDataLoadingComplete(): void {
    // Verifica se todos os dados necessários foram carregados
    const allAdoptersLoaded = this.adoptions.every(adoption => 
      this.adoptersMap.has(adoption.adopterId)
    );
    const allCatsLoaded = this.adoptions.every(adoption => 
      this.catsMap.has(adoption.catId)
    );

    if (allAdoptersLoaded && allCatsLoaded) {
      this.enrichAdoptionData();
      this.loadingRelatedData = false;
      this.cdr.markForCheck();
    }
  }

  /**
   * Manipula a seleção de arquivo de imagem do termo
   * Valida o arquivo e cria um preview se for válido
   */
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const validation = this.uploadService.validateImageFile(file);
    if (!validation.valid) {
      this.notificationService.showError(
        'Arquivo Inválido',
        validation.error || 'O arquivo selecionado não é válido.'
      );
      // Limpar o input file
      event.target.value = '';
      return;
    }

    this.selectedFile = file;
    this.createImagePreview(file);
  }

  /**
   * Cria um preview da imagem selecionada
   */
  private createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Remove o arquivo selecionado e o preview
   */
  onFileRemove(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.photoRemoved = true;
  }
}
