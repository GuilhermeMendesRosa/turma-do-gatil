
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AdoptionService } from '../../services/adoption.service';
import { Adoption, AdoptionStatus, Page } from '../../models/adoption.model';
import { AdopterService } from '../../services/adopter.service';
import { CatService } from '../../services/cat.service';
import { Adopter } from '../../models/adopter.model';
import { Cat } from '../../models/cat.model';

@Component({
  selector: 'app-adocoes',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './adocoes.component.html',
  styleUrls: ['./adocoes.component.css']
})
export class AdocoesComponent implements OnInit {
  // ...existing code...

  onRowsChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.onPageChange({first: 0, rows: +target.value, page: 0});
  }
  adoptions: Adoption[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  first: number = 0;
  rows: number = 10;

  adoptersMap: { [id: string]: Adopter } = {};
  catsMap: { [id: string]: Cat } = {};

  constructor(
    private adoptionService: AdoptionService,
    private adopterService: AdopterService,
    private catService: CatService
  ) {}

  ngOnInit(): void {
    this.loadAdoptions();
  }

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

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.loadAdoptions();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
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

  getAdopterName(adopterId: string): string {
    const adopter = this.adoptersMap[adopterId];
    return adopter ? `${adopter.firstName} ${adopter.lastName}` : '...';
  }

  getCatName(catId: string): string {
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
}
