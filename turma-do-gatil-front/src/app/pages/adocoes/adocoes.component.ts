
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdoptionService } from '../../services/adoption.service';
import { Adoption, AdoptionStatus, Page } from '../../models/adoption.model';
import { AdopterService } from '../../services/adopter.service';
import { CatService } from '../../services/cat.service';
import { Adopter } from '../../models/adopter.model';
import { Cat } from '../../models/cat.model';
// Imports dos componentes genéricos
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

@Component({
  selector: 'app-adocoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    ContentCardComponent,
    DataTableComponent,
    PaginationComponent,
    GenericModalComponent
  ],
  templateUrl: './adocoes.component.html',
  styleUrls: ['./adocoes.component.css']
})
export class AdocoesComponent implements OnInit {
  // Dados existentes
  adoptions: Adoption[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  first: number = 0;
  rows: number = 10;

  adoptersMap: { [id: string]: Adopter } = {};
  catsMap: { [id: string]: Cat } = {};

  // Propriedades do modal genérico
  showStatusModal = false;
  selectedAdoption: Adoption | null = null;
  selectedStatus: AdoptionStatus | '' = '';
  modalLoading = false;

  // Configuração da tabela genérica
  tableColumns: TableColumn[] = [
    {
      key: 'catId',
      header: 'Gato',
      type: 'text',
      formatter: (value: string) => this.getCatName(value)
    },
    {
      key: 'adopterId',
      header: 'Adotante',
      type: 'text',
      formatter: (value: string) => this.getAdopterName(value)
    },
    {
      key: 'adoptionDate',
      header: 'Data da Adoção',
      type: 'date',
      formatter: (value: string) => this.formatDate(value)
    },
    {
      key: 'status',
      header: 'Status',
      type: 'badge',
      formatter: (value: AdoptionStatus) => this.getStatusLabel(value),
      badgeClass: (value: AdoptionStatus) => this.getStatusClass(value)
    }
  ];

  // Estado vazio da tabela
  emptyState: TableEmptyState = {
    icon: 'pi pi-info-circle',
    message: 'Nenhuma adoção encontrada.'
  };

  // Informações de paginação para o componente genérico
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

  // Ações do modal genérico
  get modalActions(): ModalAction[] {
    return [
      {
        label: 'Cancelar',
        icon: 'pi-times',
        severity: 'secondary',
        outlined: true,
        action: () => this.onHideModal()
      },
      {
        label: 'Salvar',
        icon: 'pi-check',
        severity: 'primary',
        loading: this.modalLoading,
        disabled: !this.selectedStatus || this.modalLoading,
        action: () => this.onSaveStatus()
      }
    ];
  }

  // Opções de status para o modal
  statusOptions = [
    { label: 'Pendente', value: AdoptionStatus.PENDING },
    { label: 'Concluída', value: AdoptionStatus.COMPLETED },
    { label: 'Cancelada', value: AdoptionStatus.CANCELED }
  ];

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
