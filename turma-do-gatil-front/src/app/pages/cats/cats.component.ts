import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CatService } from '../../services/cat.service';
import { Cat, Color, Sex, CatFilters, Page, CatAdoptionStatus } from '../../models/cat.model';
import { CatDetailsModalComponent } from './cat-details-modal/cat-details-modal.component';
import { CatCreateModalComponent } from './cat-create-modal/cat-create-modal.component';
// Importar componentes genéricos
import { 
  PageHeaderComponent,
  StatsGridComponent, 
  StatCardData,
  ContentCardComponent,
  GenericModalComponent,
  ModalAction,
  GenericButtonComponent,
  GenericButtonConfig
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
    PaginatorModule,
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
    GenericButtonComponent
  ],
  providers: [MessageService],
  templateUrl: './cats.component.html',
  styleUrl: './cats.component.css'
})
export class CatsComponent implements OnInit {
  cats: Cat[] = [];
  loading = false;
  totalRecords = 0;
  currentPage = 0;
  pageSize = 12;

  // Dialog de detalhes do gato
  catDetailsDialog = false;
  selectedCat: Cat | null = null;

  // Dialog de criação/edição de gato
  catCreateDialog = false;
  catToEdit: Cat | null = null; // Gato sendo editado (null para criação)

  // Dialog de confirmação de delete
  deleteConfirmDialog = false;
  catToDelete: Cat | null = null;

  // Filtros
  filters: CatFilters = {
    adoptionStatus: CatAdoptionStatus.NAO_ADOTADO, // Por padrão, mostra apenas gatos não adotados
    page: 0,
    size: 12,
    sortBy: 'name',
    sortDir: 'asc'
  };

  // Opções para os dropdowns
  colorOptions = [
    { label: 'Todas as cores', value: null },
    { label: 'Branco', value: Color.WHITE },
    { label: 'Preto', value: Color.BLACK },
    { label: 'Cinza', value: Color.GRAY },
    { label: 'Marrom', value: Color.BROWN },
    { label: 'Laranja', value: Color.ORANGE },
    { label: 'Misto', value: Color.MIXED },
    { label: 'Cálico', value: Color.CALICO },
    { label: 'Tigrado', value: Color.TABBY },
    { label: 'Siamês', value: Color.SIAMESE },
    { label: 'Outro', value: Color.OTHER }
  ];

  sexOptions = [
    { label: 'Todos os sexos', value: null },
    { label: 'Macho', value: Sex.MALE },
    { label: 'Fêmea', value: Sex.FEMALE }
  ];

  adoptionStatusOptions = [
    { label: 'Disponíveis para adoção', value: CatAdoptionStatus.NAO_ADOTADO },
    { label: 'Em processo de adoção', value: CatAdoptionStatus.EM_PROCESSO },
    { label: 'Já adotados', value: CatAdoptionStatus.ADOTADO },
    { label: 'Todos os gatos', value: null }
  ];

  sortOptions = [
    { label: 'Nome (A-Z)', value: 'name' },
    { label: 'Nome (Z-A)', value: 'name-desc' },
    { label: 'Idade (Mais novo)', value: 'birthDate' },
    { label: 'Idade (Mais velho)', value: 'birthDate-desc' },
    { label: 'Data de entrada', value: 'shelterEntryDate' }
  ];

  pageSizeOptions = [
    { label: '6', value: 6 },
    { label: '12', value: 12 },
    { label: '24', value: 24 },
    { label: '48', value: 48 }
  ];

  // Expor Math para o template
  Math = Math;

  // Dados para os componentes genéricos
  get statsData(): StatCardData[] {
    return [
      {
        number: this.getAvailableCatsCount(),
        label: 'Disponíveis',
        description: 'Gatos prontos para adoção',
        icon: 'pi-heart',
        type: 'success' // Verde como no original (.stat-icon.available)
      },
      {
        number: this.getAdoptedCatsCount(),
        label: 'Adotados',
        description: 'Gatos que encontraram um lar',
        icon: 'pi-home',
        type: 'warning' // Laranja como no original (.stat-icon.adopted)
      },
      {
        number: this.totalRecords,
        label: 'Total',
        description: 'Total de gatos cadastrados',
        icon: 'pi-tag',
        type: 'primary' // Gradient primary como no original (.stat-icon.total)
      }
    ];
  }

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

  // Configurações dos botões genéricos
  get newCatButtonConfig(): GenericButtonConfig {
    return {
      label: 'Novo Gato',
      icon: 'pi-plus',
      severity: 'primary',
      size: 'small'
    };
  }

  get clearFiltersButtonConfig(): GenericButtonConfig {
    return {
      label: 'Limpar',
      icon: 'pi-filter-slash',
      severity: 'secondary',
      outlined: true,
      size: 'small'
    };
  }

  get clearFiltersEmptyButtonConfig(): GenericButtonConfig {
    return {
      label: 'Limpar Filtros',
      icon: 'pi-filter-slash',
      severity: 'secondary',
      outlined: true
    };
  }

  get addFirstCatButtonConfig(): GenericButtonConfig {
    return {
      label: 'Cadastrar Primeiro Gato',
      icon: 'pi-plus',
      severity: 'primary'
    };
  }

  constructor(
    private catService: CatService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadCats();
  }

  loadCats(): void {
    this.loading = true;
    
    // Remove propriedades undefined do filtro
    const cleanFilters = Object.keys(this.filters).reduce((acc, key) => {
      const value = (this.filters as any)[key];
      if (value !== null && value !== undefined && value !== '') {
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as CatFilters);

    this.catService.getAllCats(cleanFilters).subscribe({
      next: (response: Page<Cat>) => {
        this.cats = response.content;
        this.totalRecords = response.totalElements;
        this.currentPage = response.number;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar gatos:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.filters.page = event.page;
    this.loadCats();
  }

  onFilterChange(): void {
    this.filters.page = 0; // Reset para primeira página ao filtrar
    this.loadCats();
  }

  onSortChange(): void {
    const sortValue = this.filters.sortBy;
    if (sortValue?.includes('-desc')) {
      this.filters.sortBy = sortValue.replace('-desc', '');
      this.filters.sortDir = 'desc';
    } else {
      this.filters.sortBy = sortValue;
      this.filters.sortDir = 'asc';
    }
    this.filters.page = 0;
    this.loadCats();
  }

  clearFilters(): void {
    this.filters = {
      adoptionStatus: CatAdoptionStatus.NAO_ADOTADO, // Manter filtro padrão para não adotados
      page: 0,
      size: 12,
      sortBy: 'name',
      sortDir: 'asc'
    };
    this.loadCats();
  }

  getAvailableCatsCount(): number {
    // Se está filtrando por não adotados, retorna o total
    if (this.filters.adoptionStatus === CatAdoptionStatus.NAO_ADOTADO) {
      return this.totalRecords;
    }
    // Se está filtrando por em processo, retorna o total
    if (this.filters.adoptionStatus === CatAdoptionStatus.EM_PROCESSO) {
      return this.totalRecords;
    }
    // Caso contrário, conta os não adotados e em processo na lista atual
    return this.cats.filter(cat => 
      cat.adoptionStatus === CatAdoptionStatus.NAO_ADOTADO || 
      cat.adoptionStatus === CatAdoptionStatus.EM_PROCESSO
    ).length;
  }

  getAdoptedCatsCount(): number {
    // Se está filtrando por adotados, retorna o total
    if (this.filters.adoptionStatus === CatAdoptionStatus.ADOTADO) {
      return this.totalRecords;
    }
    // Caso contrário, conta os adotados na lista atual
    return this.cats.filter(cat => cat.adoptionStatus === CatAdoptionStatus.ADOTADO).length;
  }

  openAddCatDialog(): void {
    this.catToEdit = null; // Limpar gato para criação
    this.catCreateDialog = true;
  }

  onCatCreated(): void {
    this.catCreateDialog = false;
    this.catToEdit = null;
    this.loadCats(); // Recarrega a lista de gatos
  }

  onCatUpdated(): void {
    this.catCreateDialog = false;
    this.catToEdit = null;
    this.loadCats(); // Recarrega a lista de gatos
  }

  trackByCatId(index: number, cat: Cat): string {
    return cat.id;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  viewCatDetails(cat: Cat): void {
    this.selectedCat = cat;
    this.catDetailsDialog = true;
  }

  editCat(cat: Cat): void {
    this.catToEdit = cat;
    this.catCreateDialog = true;
    this.catDetailsDialog = false; // Fechar o modal de detalhes
  }

  adoptCat(cat: Cat): void {
    // A adoção foi processada no modal, recarregar os dados
    this.catDetailsDialog = false;
    this.selectedCat = null;
    this.loadCats(); // Recarrega a lista para atualizar o status de adoção
    
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `A adoção do gato "${cat.name}" foi registrada com sucesso!`
    });
  }

  deleteCat(cat: Cat): void {
    this.catToDelete = cat;
    this.deleteConfirmDialog = true;
  }

  cancelDelete(): void {
    this.deleteConfirmDialog = false;
    this.catToDelete = null;
  }

  confirmDelete(): void {
    if (this.catToDelete) {
      this.catService.deleteCat(this.catToDelete.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `O gato "${this.catToDelete!.name}" foi excluído com sucesso.`
          });
          this.catDetailsDialog = false;
          this.selectedCat = null;
          this.deleteConfirmDialog = false;
          this.catToDelete = null;
          this.loadCats(); // Recarrega a lista
        },
        error: (error) => {
          console.error('Erro ao deletar gato:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Ocorreu um erro ao tentar excluir o gato. Tente novamente.'
          });
          this.deleteConfirmDialog = false;
          this.catToDelete = null;
        }
      });
    }
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.name || 
             this.filters.color || 
             this.filters.sex || 
             (this.filters.adoptionStatus !== CatAdoptionStatus.NAO_ADOTADO && this.filters.adoptionStatus !== undefined));
  }

  onPageSizeChange(): void {
    this.filters.size = this.pageSize;
    this.filters.page = 0;
    this.loadCats();
  }

  getColorLabel(color: Color): string {
    const colorMap: { [key in Color]: string } = {
      [Color.WHITE]: 'Branco',
      [Color.BLACK]: 'Preto',
      [Color.GRAY]: 'Cinza',
      [Color.BROWN]: 'Marrom',
      [Color.ORANGE]: 'Laranja',
      [Color.MIXED]: 'Misto',
      [Color.CALICO]: 'Cálico',
      [Color.TABBY]: 'Tigrado',
      [Color.SIAMESE]: 'Siamês',
      [Color.OTHER]: 'Outro'
    };
    return colorMap[color] || color;
  }

  getSexLabel(sex: Sex): string {
    return sex === Sex.MALE ? 'Macho' : 'Fêmea';
  }

  getAge(birthDate: string): string {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    
    if (ageInMonths < 12) {
      return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
  }

  getDefaultImage(): string {
    return 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  }

  onImageError(event: any): void {
    event.target.src = this.getDefaultImage();
  }

  getAdoptionStatusText(status: CatAdoptionStatus): string {
    switch(status) {
      case CatAdoptionStatus.NAO_ADOTADO:
        return 'Disponível';
      case CatAdoptionStatus.EM_PROCESSO:
        return 'Em Processo';
      case CatAdoptionStatus.ADOTADO:
        return 'Adotado';
      default:
        return 'Disponível';
    }
  }

  getAdoptionStatusIcon(status: CatAdoptionStatus): string {
    switch(status) {
      case CatAdoptionStatus.NAO_ADOTADO:
        return 'fa-heart';
      case CatAdoptionStatus.EM_PROCESSO:
        return 'fa-clock';
      case CatAdoptionStatus.ADOTADO:
        return 'fa-home';
      default:
        return 'fa-heart';
    }
  }

  getAdoptionStatusClass(status: CatAdoptionStatus): string {
    switch(status) {
      case CatAdoptionStatus.NAO_ADOTADO:
        return '';
      case CatAdoptionStatus.EM_PROCESSO:
        return 'in-process';
      case CatAdoptionStatus.ADOTADO:
        return 'adopted';
      default:
        return '';
    }
  }
}
