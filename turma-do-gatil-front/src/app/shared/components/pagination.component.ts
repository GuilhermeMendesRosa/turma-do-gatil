import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PaginationInfo {
  totalElements: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  totalPages: number;
  currentPage: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination-container" *ngIf="pagination.totalElements > 0">
      <div class="pagination-info">
        Mostrando {{ pagination.numberOfElements }} de {{ pagination.totalElements }} resultados
      </div>
      <div class="pagination-controls">
        <button 
          class="p-button p-button-sm p-button-secondary" 
          [disabled]="pagination.first"
          (click)="onPreviousPage()">
          <i class="pi pi-chevron-left"></i>
          Anterior
        </button>
        <select 
          class="page-select" 
          [value]="pagination.currentPage" 
          (change)="onPageChange($event)">
          <option *ngFor="let page of getPageNumbers()" [value]="page">
            Página {{ page + 1 }}
          </option>
        </select>
        <button 
          class="p-button p-button-sm p-button-secondary" 
          [disabled]="pagination.last"
          (click)="onNextPage()">
          Próxima
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--p-surface-border, #e5e7eb);
    }

    .pagination-info {
      color: var(--p-text-color-secondary, #6b7280);
      font-size: 0.9rem;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .page-select {
      padding: 0.5rem;
      border: 1px solid var(--p-surface-border, #e5e7eb);
      border-radius: 6px;
      background: var(--p-surface-card, #ffffff);
      color: var(--p-text-color, #1f2937);
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .page-select:focus {
      outline: none;
      border-color: var(--p-primary-color, #F2BBAE);
      box-shadow: 0 0 0 2px rgba(242, 187, 174, 0.2);
    }

    .p-button {
      background: var(--p-surface-card, #ffffff);
      border: 1px solid var(--p-surface-border, #e5e7eb);
      color: var(--p-text-color, #1f2937);
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
    }

    .p-button:hover:not(:disabled) {
      background: var(--p-surface-hover, #f3f4f6);
      border-color: var(--p-primary-color, #F2BBAE);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(242, 187, 174, 0.2);
    }

    .p-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .p-button-sm {
      font-size: 0.875rem;
      padding: 0.375rem 0.625rem;
    }

    .p-button-secondary {
      background: var(--p-surface-100, #f9fafb);
      border-color: var(--p-surface-300, #d1d5db);
    }

    @media (max-width: 768px) {
      .pagination-container {
        flex-direction: column;
        gap: 1rem;
      }

      .pagination-controls {
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  `]
})
export class PaginationComponent {
  @Input() pagination!: PaginationInfo;
  @Output() pageChange = new EventEmitter<number>();
  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();

  getPageNumbers(): number[] {
    return Array.from({ length: this.pagination.totalPages }, (_, i) => i);
  }

  onPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const page = parseInt(target.value);
    this.pageChange.emit(page);
  }

  onPreviousPage() {
    if (!this.pagination.first) {
      this.previousPage.emit();
    }
  }

  onNextPage() {
    if (!this.pagination.last) {
      this.nextPage.emit();
    }
  }
}
