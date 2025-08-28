import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AdopterService } from '../../services/adopter.service';
import { Adopter, AdopterFilters } from '../../models/adopter.model';
import { AdopterCreateModalComponent } from './adopter-create-modal/adopter-create-modal.component';

@Component({
  selector: 'app-adotantes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    AdopterCreateModalComponent
  ],
  templateUrl: './adotantes.component.html',
  styleUrls: ['./adotantes.component.css']
})
export class AdotantesComponent implements OnInit {
  adopters: Adopter[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  first: number = 0;
  rows: number = 10;
  
  // Modal states
  showCreateModal: boolean = false;
  selectedAdopter: Adopter | null = null;
  
  filters: AdopterFilters = {
    page: 0,
    size: 10,
    sortBy: 'firstName',
    sortDir: 'asc'
  };

  constructor(private adopterService: AdopterService) { }

  ngOnInit(): void {
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

  getMinRecord(): number {
    return Math.min(this.first + this.rows, this.totalRecords);
  }

  getLastPageFirst(): number {
    return Math.floor(this.totalRecords / this.rows) * this.rows;
  }

  getLastPage(): number {
    return Math.floor(this.totalRecords / this.rows);
  }

  // Métodos utilitários para o template
  mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  mathFloor(value: number): number {
    return Math.floor(value);
  }

  // Métodos para o modal
  openCreateModal(): void {
    this.selectedAdopter = null;
    this.showCreateModal = true;
  }

  openEditModal(adopter: Adopter): void {
    this.selectedAdopter = adopter;
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
}
