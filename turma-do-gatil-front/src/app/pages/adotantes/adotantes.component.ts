import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdopterService } from '../../services/adopter.service';
import { Adopter, AdopterFilters } from '../../models/adopter.model';

@Component({
  selector: 'app-adotantes',
  standalone: true,
  imports: [
    CommonModule
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
}
