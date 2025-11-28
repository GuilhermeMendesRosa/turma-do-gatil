import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentCardComponent } from './content-card.component';

export type FilterType = 'text' | 'select' | 'date' | 'number';

export interface FilterOption {
  label: string;
  value: any;
}

export interface FilterConfig {
  key: string;
  label: string;
  icon: string;
  type: FilterType;
  placeholder?: string;
  options?: FilterOption[];
}

@Component({
  selector: 'app-filter-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ContentCardComponent],
  template: `
    <app-content-card
      [title]="title"
      [icon]="icon"
      [hasActions]="true">
      
      <ng-content select="[slot=actions]" slot="actions"></ng-content>
      
      <div class="filters-grid">
        @for (filter of filters; track filter.key) {
          <div class="filter-group">
            <label [attr.for]="filter.key + 'Filter'">
              <i class="pi" [ngClass]="filter.icon"></i>
              {{ filter.label }}
            </label>
            
            @if (filter.type === 'text') {
              <input 
                [id]="filter.key + 'Filter'"
                type="text"
                [ngModel]="values[filter.key]"
                (ngModelChange)="onValueChange(filter.key, $event)"
                [placeholder]="filter.placeholder || ''"
                class="filter-input">
            }
            
            @if (filter.type === 'number') {
              <input 
                [id]="filter.key + 'Filter'"
                type="number"
                [ngModel]="values[filter.key]"
                (ngModelChange)="onValueChange(filter.key, $event)"
                [placeholder]="filter.placeholder || ''"
                class="filter-input">
            }
            
            @if (filter.type === 'date') {
              <input 
                [id]="filter.key + 'Filter'"
                type="date"
                [ngModel]="values[filter.key]"
                (ngModelChange)="onValueChange(filter.key, $event)"
                class="filter-input">
            }
            
            @if (filter.type === 'select') {
              <select
                [id]="filter.key + 'Filter'"
                [ngModel]="values[filter.key]"
                (ngModelChange)="onValueChange(filter.key, $event)"
                class="filter-input filter-select">
                <option value="">{{ filter.placeholder || 'Selecione...' }}</option>
                @for (option of filter.options; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            }
          </div>
        }
      </div>
    </app-content-card>
  `,
  styles: [`
    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 600;
      color: var(--p-text-color);
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-group label i {
      color: var(--p-primary-color);
      font-size: 0.85rem;
    }

    .filter-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--p-surface-border);
      border-radius: 8px;
      background: white;
      color: var(--p-text-color);
      transition: all 0.3s ease;
      min-height: 45px;
      box-sizing: border-box;
      font-size: 0.9rem;
    }

    .filter-input:focus {
      border-color: var(--p-primary-color);
      box-shadow: 0 0 0 2px rgba(242, 187, 174, 0.2);
      outline: none;
    }

    .filter-input:hover {
      border-color: var(--p-primary-color);
    }

    .filter-input::placeholder {
      color: var(--p-text-color-secondary);
    }

    .filter-select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      padding-right: 2.5rem;
    }

    @media (max-width: 768px) {
      .filters-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `]
})
export class FilterCardComponent {
  @Input() title: string = 'Filtros de Busca';
  @Input() icon: string = 'pi-filter';
  @Input() filters: FilterConfig[] = [];
  @Input() values: Record<string, any> = {};
  
  @Output() valuesChange = new EventEmitter<Record<string, any>>();
  @Output() filterChange = new EventEmitter<{ key: string; value: any }>();

  onValueChange(key: string, value: any): void {
    const newValues = { ...this.values, [key]: value };
    this.valuesChange.emit(newValues);
    this.filterChange.emit({ key, value });
  }
}
