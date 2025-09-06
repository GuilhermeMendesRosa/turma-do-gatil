import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SterilizationService } from '../../services/sterilization.service';
import { 
  SterilizationStatsDto, 
  CatSterilizationStatusDto, 
  SterilizationDto,
  Page
} from '../../models/sterilization.model';
import { SterilizationScheduleModalComponent } from './sterilization-schedule-modal/sterilization-schedule-modal.component';

@Component({
  selector: 'app-castracoes',
  standalone: true,
  imports: [CommonModule, SterilizationScheduleModalComponent],
  templateUrl: './castracoes.component.html',
  styleUrls: ['./castracoes.component.css']
})
export class CastracoesComponent implements OnInit {
  stats: SterilizationStatsDto | null = null;
  catsNeedingSterilization: CatSterilizationStatusDto[] = [];
  scheduledSterilizations: SterilizationDto[] = [];
  
  // Estados de carregamento
  loadingCats = false;
  loadingSterilizations = false;
  
  // Modal de agendamento
  scheduleModalVisible = false;
  selectedCatForSchedule: CatSterilizationStatusDto | null = null;
  selectedSterilizationForEdit: SterilizationDto | null = null;
  
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

  constructor(private sterilizationService: SterilizationService) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadStats();
    this.loadCatsNeedingSterilization();
    this.loadScheduledSterilizations();
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

  refreshData(): void {
    this.loadAllData();
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

  // Métodos de ação
  scheduleSterilization(cat: CatSterilizationStatusDto): void {
    this.selectedCatForSchedule = cat;
    this.selectedSterilizationForEdit = null;
    this.scheduleModalVisible = true;
  }

  viewCatDetails(cat: CatSterilizationStatusDto): void {
    // TODO: Implementar visualização de detalhes do gato
    console.log('Ver detalhes do gato:', cat.name);
    // Aqui você pode abrir um modal ou navegar para os detalhes do gato
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

  // Métodos de paginação
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
