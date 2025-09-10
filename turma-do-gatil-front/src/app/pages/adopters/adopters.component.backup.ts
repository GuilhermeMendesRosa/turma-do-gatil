import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DividerModule } from 'primeng/divider';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

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
  GenericModalComponent,
  ModalAction,
  ModalButtonComponent
} from '../../shared/components';

// Imports das novas funcionalidades
import { AdopterUtilsService } from './services/adopter-utils.service';
import { AdopterFormData } from './models/adopter-form.interface';
import { 
  AdopterTableAction, 
  ModalType, 
  SortDirection,
  ADOPTERS_CONFIG,
  VALIDATION_MESSAGES 
} from './constants/adopters.constants';
import { ADOPTER_FORM_FIELDS, ADOPTER_TABLE_COLUMNS_CONFIG } from './config/adopters-form.config';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputMaskModule,
    DividerModule,
    GenericModalComponent,
    DataTableComponent,
    ContentCardComponent,
    PageHeaderComponent,
    RefreshButtonComponent,
    PaginationComponent,
    ModalButtonComponent
  ],
  templateUrl: './adopters.component.html',
  styleUrls: ['./adopters.component.css']
})
export class AdoptersComponent implements OnInit, OnDestroy {
  // ==================== DEPENDENCY INJECTION ====================
  private readonly adopterService = inject(AdopterService);
  private readonly fb = inject(FormBuilder);
  private readonly adopterUtils = inject(AdopterUtilsService);
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
  selectedAdopter: Adopter | null = null;
  currentModalType: ModalType = ModalType.CREATE;
  adopterForm!: FormGroup<any>;
  modalActions: ModalAction[] = [];
  
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

  // ==================== CONFIGURAÇÕES DO FORMULÁRIO ====================
  readonly formFields = ADOPTER_FORM_FIELDS;

  // ==================== COMPUTED PROPERTIES ====================
  /**
   * Verifica se o modal está em modo de edição
   */
  get isEditMode(): boolean {
    return this.currentModalType === ModalType.EDIT;
  }

  /**
   * Obtém o título do modal baseado no modo atual
   */
  get modalTitle(): string {
    return this.isEditMode ? 'Editar Adotante' : 'Adicionar Novo Adotante';
  }

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
    this.initForm();
    this.setupModalActions();
    this.loadAdopters();
    this.setupFilterSubscription();
  }

  /**
   * Configura subscription para filtros com debounce
   */
  private setupFilterSubscription(): void {
    // Implementar se necessário para filtros reativos
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
          this.adopterUtils.getFullName(item.firstName, item.lastName)
      },
      {
        key: 'email',
        header: 'Email',
        type: 'text',
        sortable: true
      },
      {
        key: 'cpf',
        header: 'CPF',
        type: 'text',
        sortable: true,
        formatter: (value: string) => this.adopterUtils.formatCpf(value)
      },
      {
        key: 'phone',
        header: 'Telefone',
        type: 'text',
        formatter: (value: string) => this.adopterUtils.formatPhone(value)
      },
      {
        key: 'registrationDate',
        header: 'Data de Cadastro',
        type: 'date',
        sortable: true,
        formatter: (value: string) => this.adopterUtils.formatDate(value)
      }
    ];
  }

  // ==================== CARREGAMENTO DE DADOS ====================
  /**
   * Carrega lista de adotantes com filtros aplicados
   */
  loadAdopters(): void {
    this.setLoadingState(true);
    
    this.adopterService.getAllAdopters(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.handleAdoptersLoaded(response),
        error: (error) => this.handleLoadError(error)
      });
  }

  /**
   * Manipula resposta do carregamento de adotantes
   */
  private handleAdoptersLoaded(response: any): void {
    this.adopters = response.content;
    this.totalRecords = response.totalElements;
    this.setLoadingState(false);
  }

  /**
   * Manipula erros no carregamento
   */
  private handleLoadError(error: any): void {
    console.error('Erro ao carregar adotantes:', error);
    this.setLoadingState(false);
    // TODO: Implementar notificação de erro para o usuário
  }

  /**
   * Define estado de carregamento
   */
  private setLoadingState(loading: boolean): void {
    this.loading = loading;
    if (this.showCreateModal) {
      this.setupModalActions();
    }
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
    // Reset para primeira página quando filtros mudam
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
        type: AdopterTableAction.EDIT,
        tooltip: this.adopterUtils.generateActionTooltip('edit', adopter.firstName, adopter.lastName)
      },
      {
        type: 'cancel', // Usando cancel para representar delete
        tooltip: this.adopterUtils.generateActionTooltip('delete', adopter.firstName, adopter.lastName)
      }
    ];
  };

  /**
   * Manipula ações da tabela
   */
  onAdopterTableAction(event: {type: string, data: Adopter}): void {
    switch (event.type) {
      case AdopterTableAction.EDIT:
        this.openEditModal(event.data);
        break;
      case 'cancel': // delete
        this.confirmDeleteAdopter(event.data);
        break;
    }
  }

  /**
   * Confirma exclusão de adotante
   */
  private confirmDeleteAdopter(adopter: Adopter): void {
    const fullName = this.adopterUtils.getFullName(adopter.firstName, adopter.lastName);
    
    if (confirm(`Tem certeza que deseja excluir o adotante ${fullName}?`)) {
      this.deleteAdopter(adopter);
    }
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
    // TODO: Implementar notificação de sucesso
  }

  /**
   * Manipula erro na exclusão
   */
  private handleDeleteError(error: any): void {
    console.error('Erro ao excluir adotante:', error);
    alert('Erro ao excluir adotante. Tente novamente.');
    // TODO: Implementar notificação de erro mais elegante
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
   * Abre modal para criação de novo adotante
   */
  openCreateModal(): void {
    this.resetModalState();
    this.currentModalType = ModalType.CREATE;
    this.resetForm();
    this.setupModalActions();
    this.showCreateModal = true;
  }

  /**
   * Abre modal para edição de adotante
   */
  openEditModal(adopter: Adopter): void {
    this.resetModalState();
    this.selectedAdopter = adopter;
    this.currentModalType = ModalType.EDIT;
    this.updateFormForEditing();
    this.setupModalActions();
    this.showCreateModal = true;
  }

  /**
   * Reseta estado do modal
   */
  private resetModalState(): void {
    this.selectedAdopter = null;
    this.currentModalType = ModalType.CREATE;
  }

  /**
   * Callback para quando adotante é criado
   */
  onAdopterCreated(): void {
    this.loadAdopters();
    // TODO: Implementar notificação de sucesso
  }

  /**
   * Callback para quando adotante é atualizado
   */
  onAdopterUpdated(): void {
    this.loadAdopters();
    // TODO: Implementar notificação de sucesso
  }

  /**
   * Cancela ação do modal
   */
  onModalCancel(): void {
    this.showCreateModal = false;
    this.resetForm();
    this.resetModalState();
  }

  // ==================== MÉTODOS DO FORMULÁRIO ====================
  /**
   * Inicializa o formulário reativo
   */
  initForm(): void {
    const today = this.adopterUtils.getCurrentDateForInput();
    
    this.adopterForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(ADOPTERS_CONFIG.MIN_NAME_LENGTH)]],
      lastName: ['', [Validators.required, Validators.minLength(ADOPTERS_CONFIG.MIN_NAME_LENGTH)]],
      birthDate: ['', Validators.required],
      cpf: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(ADOPTERS_CONFIG.MIN_ADDRESS_LENGTH)]],
      registrationDate: [today, Validators.required]
    });

    this.setupFormStatusSubscription();
  }

  /**
   * Configura subscription para mudanças no status do formulário
   */
  private setupFormStatusSubscription(): void {
    this.adopterForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.showCreateModal) {
          this.updateModalSaveButton();
        }
      });
  }

  /**
   * Atualiza estado do botão salvar no modal
   */
  private updateModalSaveButton(): void {
    const saveAction = this.modalActions.find(action => action.icon === 'pi pi-check');
    if (saveAction) {
      saveAction.disabled = this.isFormInvalid();
    }
  }

  /**
   * Atualiza formulário para modo de edição
   */
  updateFormForEditing(): void {
    if (this.selectedAdopter) {
      const formData = this.mapAdopterToFormData(this.selectedAdopter);
      this.adopterForm.patchValue(formData);
    }
  }

  /**
   * Mapeia dados do adotante para formato do formulário
   */
  private mapAdopterToFormData(adopter: Adopter): Partial<AdopterFormData> {
    return {
      firstName: adopter.firstName,
      lastName: adopter.lastName,
      birthDate: this.adopterUtils.toInputDateFormat(adopter.birthDate),
      cpf: adopter.cpf,
      phone: adopter.phone,
      email: adopter.email,
      address: adopter.address,
      registrationDate: this.adopterUtils.toInputDateFormat(adopter.registrationDate)
    };
  }

  /**
   * Reseta o formulário para estado inicial
   */
  resetForm(): void {
    this.adopterForm.reset();
    const today = this.adopterUtils.getCurrentDateForInput();
    
    this.adopterForm.patchValue({
      registrationDate: today
    });
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

  /**
   * Configura ações do modal
   */
  setupModalActions(): void {
    this.modalActions = [
      {
        label: 'Cancelar',
        icon: 'pi pi-times',
        severity: 'secondary',
        outlined: true,
        action: () => this.onModalCancel()
      },
      {
        label: this.isEditMode ? 'Salvar Alterações' : 'Salvar Adotante',
        icon: 'pi pi-check',
        severity: 'primary',
        loading: this.loading,
        disabled: this.isFormInvalid(),
        action: () => this.onSubmit()
      }
    ];
  }

  /**
   * Verifica se o formulário é inválido
   */
  private isFormInvalid(): boolean {
    return !this.adopterForm?.valid;
  }

  // ==================== SUBMISSÃO DO FORMULÁRIO ====================
  /**
   * Manipula submissão do formulário
   */
  onSubmit(): void {
    if (this.adopterForm.valid) {
      this.setLoadingState(true);
      const adopterData = this.buildAdopterRequest();
      
      if (this.isEditMode && this.selectedAdopter) {
        this.updateAdopter(adopterData);
      } else {
        this.createAdopter(adopterData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Constrói objeto de requisição do adotante
   */
  private buildAdopterRequest(): AdopterRequest {
    const formValue = this.adopterForm.value;
    
    return {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      birthDate: new Date(formValue.birthDate).toISOString(),
      cpf: formValue.cpf,
      phone: formValue.phone,
      email: formValue.email,
      address: formValue.address,
      registrationDate: new Date(formValue.registrationDate).toISOString()
    };
  }

  /**
   * Cria novo adotante
   */
  private createAdopter(adopterData: AdopterRequest): void {
    this.adopterService.createAdopter(adopterData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleAdopterSaved(),
        error: (error) => this.handleSaveError(error),
        complete: () => this.setLoadingState(false)
      });
  }

  /**
   * Atualiza adotante existente
   */
  private updateAdopter(adopterData: AdopterRequest): void {
    if (!this.selectedAdopter) return;
    
    this.adopterService.updateAdopter(this.selectedAdopter.id, adopterData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleAdopterSaved(),
        error: (error) => this.handleSaveError(error),
        complete: () => this.setLoadingState(false)
      });
  }

  /**
   * Manipula sucesso na gravação
   */
  private handleAdopterSaved(): void {
    this.loadAdopters();
    this.showCreateModal = false;
    this.resetForm();
    this.resetModalState();
    // TODO: Implementar notificação de sucesso
  }

  /**
   * Manipula erro na gravação
   */
  private handleSaveError(error: any): void {
    console.error('Erro ao salvar adotante:', error);
    // TODO: Implementar notificação de erro mais elegante
  }

  /**
   * Marca todos os campos do formulário como tocados
   */
  private markFormGroupTouched(): void {
    Object.keys(this.adopterForm.controls).forEach(key => {
      const control = this.adopterForm.get(key);
      control?.markAsTouched();
    });
  }

  // ==================== VALIDAÇÃO E MENSAGENS DE ERRO ====================
  /**
   * Obtém mensagem de erro para um campo específico
   */
  getFieldError(fieldName: string): string | null {
    const field = this.adopterForm.get(fieldName);
    if (field?.errors && field.touched) {
      const errorType = Object.keys(field.errors)[0];
      const fieldMessages = VALIDATION_MESSAGES[fieldName as keyof typeof VALIDATION_MESSAGES];
      
      if (fieldMessages && fieldMessages[errorType]) {
        return fieldMessages[errorType];
      }
      
      // Fallback para erros genéricos
      return this.getGenericErrorMessage(errorType, field.errors[errorType]);
    }
    return null;
  }

  /**
   * Obtém mensagem de erro genérica
   */
  private getGenericErrorMessage(errorType: string, errorValue: any): string {
    switch (errorType) {
      case 'required':
        return 'Este campo é obrigatório';
      case 'minlength':
        return `Mínimo de ${errorValue.requiredLength} caracteres`;
      case 'email':
        return 'Email inválido';
      default:
        return 'Campo inválido';
    }
  }

  /**
   * Verifica se um campo é inválido
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.adopterForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
}
