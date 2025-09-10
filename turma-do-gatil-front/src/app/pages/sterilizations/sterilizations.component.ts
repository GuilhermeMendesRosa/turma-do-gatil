import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SterilizationService } from '../../services/sterilization.service';
import { 
  SterilizationStatsDto, 
  CatSterilizationStatusDto, 
  SterilizationDto,
  Page
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

@Component({
  selector: 'app-sterilizations',
  standalone: true,
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
export class SterilizationsComponent implements OnInit {
  stats: SterilizationStatsDto | null = null;
  catsNeedingSterilization: CatSterilizationStatusDto[] = [];
  scheduledSterilizations: SterilizationDto[] = [];
  completedSterilizations: SterilizationDto[] = [];
  
  // Estados de carregamento
  loadingCats = false;
  loadingSterilizations = false;
  loadingCompletedSterilizations = false;
  
  // Modal de agendamento
  scheduleModalVisible = false;
  selectedCatForSchedule: CatSterilizationStatusDto | null = null;
  selectedSterilizationForEdit: SterilizationDto | null = null;
  
  // Configurações das tabelas
  catsTableColumns: TableColumn[] = [
    {
      key: 'photoUrl',
      header: 'Foto',
      type: 'image',
      width: '80px',
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
      formatter: (value: string) => this.getSexLabel(value)
    },
    {
      key: 'color',
      header: 'Cor',
      type: 'text',
      formatter: (value: string) => this.getColorLabel(value)
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
      formatter: (value: string) => this.getStatusLabel(value),
      badgeClass: (value: string) => value.toLowerCase()
    }
  ];

  scheduledTableColumns: TableColumn[] = [
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
      formatter: (value: string) => this.getSterilizationStatusLabel(value),
      badgeClass: (value: string) => value.toLowerCase()
    },
    {
      key: 'notes',
      header: 'Observações',
      type: 'notes'
    }
  ];

  completedTableColumns: TableColumn[] = [
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
      formatter: (value: string) => this.getSterilizationStatusLabel(value),
      badgeClass: () => 'completed'
    },
    {
      key: 'notes',
      header: 'Observações',
      type: 'notes'
    }
  ];

  // Estados vazios das tabelas
  catsEmptyState: TableEmptyState = {
    icon: 'pi pi-check-circle',
    message: 'Não há gatos que precisam de castração no momento!'
  };

  scheduledEmptyState: TableEmptyState = {
    icon: 'pi pi-calendar-times',
    message: 'Nenhuma castração agendada no momento.'
  };

  completedEmptyState: TableEmptyState = {
    icon: 'pi pi-info-circle',
    message: 'Nenhuma castração foi realizada ainda.'
  };
  
  // Paginação
  currentPage = 0;
  pageSize = 10;
  sterilizationsPagination: Page<SterilizationDto> = {
    content: [],
    pageable: {
      sort: { empty: true, sorted: false, unsorted: true },
      offset: 0,
      pageSize: 10,
      pageNumber: 0,
      paged: true,
      unpaged: false
    },
    last: true,
    totalPages: 0,
    totalElements: 0,
    size: 10,
    number: 0,
    sort: { empty: true, sorted: false, unsorted: true },
    first: true,
    numberOfElements: 0,
    empty: true
  };

  // Paginação para castrações realizadas
  currentCompletedPage = 0;
  completedSterilizationsPagination: Page<SterilizationDto> = {
    content: [],
    pageable: {
      sort: { empty: true, sorted: false, unsorted: true },
      offset: 0,
      pageSize: 10,
      pageNumber: 0,
      paged: true,
      unpaged: false
    },
    last: true,
    totalPages: 0,
    totalElements: 0,
    size: 10,
    number: 0,
    sort: { empty: true, sorted: false, unsorted: true },
    first: true,
    numberOfElements: 0,
    empty: true
  };

  constructor(private sterilizationService: SterilizationService) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadStats();
    this.loadCatsNeedingSterilization();
    this.loadScheduledSterilizations();
    this.loadCompletedSterilizations();
  }

  loadStats(): void {
    this.sterilizationService.getSterilizationStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
      }
    });
  }

  loadCatsNeedingSterilization(): void {
    this.loadingCats = true;
    this.sterilizationService.getCatsNeedingSterilization().subscribe({
      next: (cats) => {
        this.catsNeedingSterilization = cats;
        this.loadingCats = false;
      },
      error: (error) => {
        console.error('Erro ao carregar gatos que precisam de castração:', error);
        this.loadingCats = false;
      }
    });
  }

  loadScheduledSterilizations(): void {
    this.loadingSterilizations = true;
    this.sterilizationService.getSterilizationsByStatus('SCHEDULED', {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'sterilizationDate',
      sortDir: 'asc'
    }).subscribe({
      next: (response) => {
        this.sterilizationsPagination = response;
        this.scheduledSterilizations = response.content;
        this.loadingSterilizations = false;
      },
      error: (error) => {
        console.error('Erro ao carregar castrações agendadas:', error);
        this.loadingSterilizations = false;
      }
    });
  }

  loadCompletedSterilizations(): void {
    this.loadingCompletedSterilizations = true;
    this.sterilizationService.getSterilizationsByStatus('COMPLETED', {
      page: this.currentCompletedPage,
      size: this.pageSize,
      sortBy: 'sterilizationDate',
      sortDir: 'desc'
    }).subscribe({
      next: (response) => {
        this.completedSterilizationsPagination = response;
        this.completedSterilizations = response.content;
        this.loadingCompletedSterilizations = false;
      },
      error: (error) => {
        console.error('Erro ao carregar castrações realizadas:', error);
        this.loadingCompletedSterilizations = false;
      }
    });
  }

  refreshData(): void {
    this.loadAllData();
  }

  // Dados para os cards de estatísticas
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

  // Métodos de formatação
  getSexLabel(sex: string): string {
    switch (sex) {
      case 'MALE': return 'Macho';
      case 'FEMALE': return 'Fêmea';
      default: return sex;
    }
  }

  getColorLabel(color: string): string {
    switch (color) {
      case 'WHITE': return 'Branco';
      case 'BLACK': return 'Preto';
      case 'GRAY': return 'Cinza';
      case 'ORANGE': return 'Laranja';
      case 'BROWN': return 'Marrom';
      case 'MIXED': return 'Misto';
      case 'OTHER': return 'Outro';
      default: return color;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ELIGIBLE': return 'Elegível';
      case 'OVERDUE': return 'Atrasada';
      default: return status;
    }
  }

  getSterilizationStatusLabel(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'Agendada';
      case 'COMPLETED': return 'Realizada';
      case 'CANCELED': return 'Cancelada';
      default: return status;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Métodos de ação das tabelas
  getCatsTableActions = (cat: CatSterilizationStatusDto): ActionButtonConfig[] => {
    return [
      {
        type: 'schedule',
        tooltip: `Agendar castração para ${cat.name}`
      }
    ];
  }

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

  onCatsTableAction(event: {type: string, data: any}): void {
    if (event.type === 'schedule') {
      this.scheduleSterilization(event.data);
    }
  }

  onScheduledTableAction(event: {type: string, data: any}): void {
    switch (event.type) {
      case 'edit':
        this.editSterilization(event.data);
        break;
      case 'complete':
        this.completeSterilization(event.data);
        break;
      case 'cancel':
        this.cancelSterilization(event.data);
        break;
    }
  }

  getScheduledPaginationInfo(): PaginationInfo {
    return {
      totalElements: this.sterilizationsPagination.totalElements,
      numberOfElements: this.sterilizationsPagination.numberOfElements,
      first: this.sterilizationsPagination.first,
      last: this.sterilizationsPagination.last,
      totalPages: this.sterilizationsPagination.totalPages,
      currentPage: this.currentPage
    };
  }

  getCompletedPaginationInfo(): PaginationInfo {
    return {
      totalElements: this.completedSterilizationsPagination.totalElements,
      numberOfElements: this.completedSterilizationsPagination.numberOfElements,
      first: this.completedSterilizationsPagination.first,
      last: this.completedSterilizationsPagination.last,
      totalPages: this.completedSterilizationsPagination.totalPages,
      currentPage: this.currentCompletedPage
    };
  }

  scheduleSterilization(cat: CatSterilizationStatusDto): void {
    this.selectedCatForSchedule = cat;
    this.selectedSterilizationForEdit = null;
    this.scheduleModalVisible = true;
  }

  editSterilization(sterilization: SterilizationDto): void {
    this.selectedSterilizationForEdit = sterilization;
    this.selectedCatForSchedule = null;
    this.scheduleModalVisible = true;
  }

  completeSterilization(sterilization: SterilizationDto): void {
    if (confirm(`Confirma que a castração de ${sterilization.cat} foi realizada?`)) {
      const updatedSterilization = {
        catId: sterilization.catId,
        sterilizationDate: sterilization.sterilizationDate,
        status: 'COMPLETED' as const,
        notes: sterilization.notes
      };

      this.sterilizationService.updateSterilization(sterilization.id!, updatedSterilization).subscribe({
        next: () => {
          console.log('Castração marcada como realizada');
          this.loadScheduledSterilizations();
          this.loadCompletedSterilizations(); // Atualiza também as castrações realizadas
          this.loadStats(); // Atualiza as estatísticas
        },
        error: (error) => {
          console.error('Erro ao atualizar castração:', error);
        }
      });
    }
  }

  cancelSterilization(sterilization: SterilizationDto): void {
    if (confirm(`Confirma o cancelamento da castração de ${sterilization.cat}?`)) {
      const updatedSterilization = {
        catId: sterilization.catId,
        sterilizationDate: sterilization.sterilizationDate,
        status: 'CANCELED' as const,
        notes: sterilization.notes
      };

      this.sterilizationService.updateSterilization(sterilization.id!, updatedSterilization).subscribe({
        next: () => {
          console.log('Castração cancelada');
          this.loadScheduledSterilizations();
        },
        error: (error) => {
          console.error('Erro ao cancelar castração:', error);
        }
      });
    }
  }

  // Métodos de paginação para castrações agendadas
  previousPage(): void {
    if (!this.sterilizationsPagination.first) {
      this.currentPage--;
      this.loadScheduledSterilizations();
    }
  }

  nextPage(): void {
    if (!this.sterilizationsPagination.last) {
      this.currentPage++;
      this.loadScheduledSterilizations();
    }
  }

  goToPage(event: any): void {
    this.currentPage = parseInt(event.target.value);
    this.loadScheduledSterilizations();
  }

  getPageNumbers(): number[] {
    const totalPages = this.sterilizationsPagination.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  // Métodos de paginação para castrações realizadas
  previousCompletedPage(): void {
    if (!this.completedSterilizationsPagination.first) {
      this.currentCompletedPage--;
      this.loadCompletedSterilizations();
    }
  }

  nextCompletedPage(): void {
    if (!this.completedSterilizationsPagination.last) {
      this.currentCompletedPage++;
      this.loadCompletedSterilizations();
    }
  }

  goToCompletedPage(event: any): void {
    this.currentCompletedPage = parseInt(event.target.value);
    this.loadCompletedSterilizations();
  }

  getCompletedPageNumbers(): number[] {
    const totalPages = this.completedSterilizationsPagination.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  // Métodos do modal de agendamento
  onSterilizationScheduled(): void {
    this.loadAllData(); // Recarrega todos os dados
    this.scheduleModalVisible = false;
  }

  onSterilizationUpdated(): void {
    this.loadAllData(); // Recarrega todos os dados
    this.scheduleModalVisible = false;
  }

  onScheduleModalHide(): void {
    this.scheduleModalVisible = false;
    this.selectedCatForSchedule = null;
    this.selectedSterilizationForEdit = null;
  }
}
