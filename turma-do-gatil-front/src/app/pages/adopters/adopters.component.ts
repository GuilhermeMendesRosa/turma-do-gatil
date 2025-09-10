import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DividerModule } from 'primeng/divider';
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

@Component({
  selector: 'app-adopters',
  standalone: true,
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
export class AdoptersComponent implements OnInit {
  adopters: Adopter[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  first: number = 0;
  rows: number = 10;
  
  // Modal states
  showCreateModal: boolean = false;
  selectedAdopter: Adopter | null = null;
  isEditMode: boolean = false;
  
  // Form
  adopterForm!: FormGroup;
  modalActions: ModalAction[] = [];
  
  filters: AdopterFilters = {
    page: 0,
    size: 10,
    sortBy: 'firstName',
    sortDir: 'asc'
  };

  // Configuração da tabela
  adoptersTableColumns: TableColumn[] = [
    {
      key: 'firstName',
      header: 'Nome',
      type: 'text',
      sortable: true,
      formatter: (value: string, item: Adopter) => this.getFullName(item)
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
      formatter: (value: string) => this.formatCpf(value)
    },
    {
      key: 'phone',
      header: 'Telefone',
      type: 'text',
      formatter: (value: string) => this.formatPhone(value)
    },
    {
      key: 'registrationDate',
      header: 'Data de Cadastro',
      type: 'date',
      sortable: true
    }
  ];

  // Estado vazio da tabela
  emptyState: TableEmptyState = {
    icon: 'pi pi-users',
    message: 'Nenhum adotante encontrado.'
  };

  constructor(
    private adopterService: AdopterService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setupModalActions(); // Inicializar ações do modal
    this.loadAdopters();
  }

  loadAdopters(): void {
    this.loading = true;
    this.adopterService.getAllAdopters(this.filters).subscribe({
      next: (response) => {
        this.adopters = response.content;
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar adotantes:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.filters.page = event.page;
    this.filters.size = event.rows;
    this.loadAdopters();
  }

  onSort(event: any): void {
    this.filters.sortBy = event.field;
    this.filters.sortDir = event.order === 1 ? 'asc' : 'desc';
    this.loadAdopters();
  }

  onRowsChange(event: any): void {
    const target = event.target as HTMLSelectElement;
    this.onPageChange({first: 0, rows: +target.value, page: 0});
  }

  onFilterChange(): void {
    // Reset para primeira página quando filtros mudam
    this.first = 0;
    this.filters.page = 0;
    this.loadAdopters();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  formatCpf(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatPhone(phone: string): string {
    if (!phone) return '';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  getFullName(adopter: Adopter): string {
    return `${adopter.firstName} ${adopter.lastName}`;
  }

  // Métodos para ações da tabela
  getAdopterActions = (adopter: Adopter): ActionButtonConfig[] => {
    return [
      {
        type: 'edit',
        tooltip: `Editar ${this.getFullName(adopter)}`
      },
      {
        type: 'cancel', // Usando cancel para representar delete
        tooltip: `Excluir ${this.getFullName(adopter)}`
      }
    ];
  };

  onAdopterTableAction(event: {type: string, data: Adopter}): void {
    switch (event.type) {
      case 'edit':
        this.openEditModal(event.data);
        break;
      case 'cancel': // delete
        this.deleteAdopter(event.data);
        break;
    }
  }

  // Método para paginação info
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

  // Métodos de paginação adaptados
  previousPage(): void {
    if (this.first > 0) {
      this.onPageChange({
        first: this.first - this.rows,
        rows: this.rows,
        page: Math.floor(this.first / this.rows) - 1
      });
    }
  }

  nextPage(): void {
    if (this.first + this.rows < this.totalRecords) {
      this.onPageChange({
        first: this.first + this.rows,
        rows: this.rows,
        page: Math.floor(this.first / this.rows) + 1
      });
    }
  }

  goToPage(event: any): void {
    const page = parseInt(event.target.value);
    this.onPageChange({
      first: page * this.rows,
      rows: this.rows,
      page: page
    });
  }

  // Métodos para o modal
  openCreateModal(): void {
    this.selectedAdopter = null;
    this.isEditMode = false;
    this.resetForm();
    this.setupModalActions();
    this.showCreateModal = true;
  }

  openEditModal(adopter: Adopter): void {
    this.selectedAdopter = adopter;
    this.isEditMode = true;
    this.updateFormForEditing();
    this.setupModalActions();
    this.showCreateModal = true;
  }

  onAdopterCreated(): void {
    this.loadAdopters();
  }

  onAdopterUpdated(): void {
    this.loadAdopters();
  }

  deleteAdopter(adopter: Adopter): void {
    if (confirm(`Tem certeza que deseja excluir o adotante ${this.getFullName(adopter)}?`)) {
      this.adopterService.deleteAdopter(adopter.id).subscribe({
        next: () => {
          this.loadAdopters();
        },
        error: (error) => {
          console.error('Erro ao excluir adotante:', error);
          alert('Erro ao excluir adotante. Tente novamente.');
        }
      });
    }
  }

  // Form methods
  initForm(): void {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    this.adopterForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', Validators.required],
      cpf: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      registrationDate: [todayString, Validators.required]
    });

    // Monitora mudanças no formulário para atualizar botões
    this.adopterForm.statusChanges.subscribe(status => {
      if (this.showCreateModal) {
        // Atualizar apenas o botão de salvar
        const saveAction = this.modalActions.find(action => action.icon === 'pi pi-check');
        if (saveAction) {
          saveAction.disabled = this.isFormInvalid();
        }
      }
    });
  }

  // Button configuration methods
  getNewAdopterButtonConfig() {
    return {
      label: 'Novo Adotante',
      icon: 'pi-plus',
      severity: 'primary' as const,
      action: this.openCreateModal.bind(this)
    };
  }

  updateFormForEditing(): void {
    if (this.selectedAdopter) {
      this.isEditMode = true;
      
      // Formatar datas para input type="date"
      const birthDate = new Date(this.selectedAdopter.birthDate).toISOString().split('T')[0];
      const registrationDate = new Date(this.selectedAdopter.registrationDate).toISOString().split('T')[0];
      
      this.adopterForm.patchValue({
        firstName: this.selectedAdopter.firstName,
        lastName: this.selectedAdopter.lastName,
        birthDate: birthDate,
        cpf: this.selectedAdopter.cpf,
        phone: this.selectedAdopter.phone,
        email: this.selectedAdopter.email,
        address: this.selectedAdopter.address,
        registrationDate: registrationDate
      });
    } else {
      this.isEditMode = false;
    }
  }

  resetForm(): void {
    this.adopterForm.reset();
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    this.adopterForm.patchValue({
      registrationDate: todayString
    });
    this.isEditMode = false;
  }

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

  private isFormInvalid(): boolean {
    if (!this.adopterForm) return true;
    return !this.adopterForm.valid;
  }

  onModalCancel(): void {
    this.showCreateModal = false;
    this.resetForm();
  }

  onSubmit(): void {
    if (this.adopterForm.valid) {
      this.loading = true;
      this.setupModalActions(); // Update loading state
      
      const formValue = this.adopterForm.value;
      
      // Converter datas para string ISO
      const adopterData: AdopterRequest = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        birthDate: new Date(formValue.birthDate).toISOString(),
        cpf: formValue.cpf,
        phone: formValue.phone,
        email: formValue.email,
        address: formValue.address,
        registrationDate: new Date(formValue.registrationDate).toISOString()
      };

      if (this.isEditMode && this.selectedAdopter) {
        // Atualizar adotante existente
        this.adopterService.updateAdopter(this.selectedAdopter.id, adopterData).subscribe({
          next: () => {
            this.onAdopterUpdated();
            this.showCreateModal = false;
            this.resetForm();
          },
          error: (error) => {
            console.error('Erro ao atualizar adotante:', error);
          },
          complete: () => {
            this.loading = false;
            this.setupModalActions();
          }
        });
      } else {
        // Criar novo adotante
        this.adopterService.createAdopter(adopterData).subscribe({
          next: () => {
            this.onAdopterCreated();
            this.showCreateModal = false;
            this.resetForm();
          },
          error: (error) => {
            console.error('Erro ao criar adotante:', error);
          },
          complete: () => {
            this.loading = false;
            this.setupModalActions();
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.adopterForm.controls).forEach(key => {
      const control = this.adopterForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.adopterForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['minlength']) {
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.adopterForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
