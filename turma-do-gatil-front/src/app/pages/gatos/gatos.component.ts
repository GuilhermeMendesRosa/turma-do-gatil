import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { ImageModule } from 'primeng/image';
import { CatService } from '../../services/cat.service';
import { Cat, Color, Sex, CatFilters, Page } from '../../models/cat.model';

@Component({
  selector: 'app-gatos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    PaginatorModule,
    TagModule,
    SkeletonModule,
    TooltipModule,
    ImageModule
  ],
  templateUrl: './gatos.component.html',
  styleUrl: './gatos.component.css'
})
export class GatosComponent implements OnInit {
  cats: Cat[] = [];
  loading = false;
  totalRecords = 0;
  currentPage = 0;
  pageSize = 12;

  // Filtros
  filters: CatFilters = {
    adopted: false, // Por padrão, mostra apenas gatos não adotados
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
    { label: 'Não adotados', value: false },
    { label: 'Adotados', value: true },
    { label: 'Todos', value: null }
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

  constructor(private catService: CatService) { }

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
      adopted: false,
      page: 0,
      size: 12,
      sortBy: 'name',
      sortDir: 'asc'
    };
    this.loadCats();
  }

  getAvailableCatsCount(): number {
    if (this.filters.adopted === false) {
      return this.totalRecords;
    }
    return this.cats.filter(cat => !cat.adopted).length;
  }

  getAdoptedCatsCount(): number {
    if (this.filters.adopted === true) {
      return this.totalRecords;
    }
    return this.cats.filter(cat => cat.adopted).length;
  }

  openAddCatDialog(): void {
    // TODO: Implementar dialog para adicionar novo gato
    console.log('Abrir dialog para adicionar novo gato');
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
    // TODO: Implementar navegação para detalhes do gato
    console.log('Ver detalhes do gato:', cat);
  }

  editCat(cat: Cat): void {
    // TODO: Implementar edição do gato
    console.log('Editar gato:', cat);
  }

  adoptCat(cat: Cat): void {
    // TODO: Implementar processo de adoção
    console.log('Adotar gato:', cat);
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.name || 
             this.filters.color || 
             this.filters.sex || 
             (this.filters.adopted !== false && this.filters.adopted !== null));
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
    return 'https://via.placeholder.com/400x220/f0f0f0/666666?text=🐱';
  }

  onImageError(event: any): void {
    event.target.src = this.getDefaultImage();
  }
}
