import { Component, Input, Output, EventEmitter, TemplateRef, ViewChild, AfterViewInit, ContentChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonsGroupComponent } from './action-buttons-group.component';
import { ActionButtonConfig } from './action-button.component';

export interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'image' | 'badge' | 'date' | 'custom' | 'cat-info' | 'notes';
  width?: string;
  sortable?: boolean;
  formatter?: (value: any, item: any) => string;
  badgeClass?: (value: any, item: any) => string;
  imageProperty?: string; // Para casos onde a imagem está em uma propriedade diferente
  imageAlt?: string; // Propriedade para o alt da imagem
  imagePlaceholder?: string; // Ícone do placeholder
  customTemplate?: TemplateRef<any>; // Para conteúdo completamente customizado
}

export interface TableAction {
  buttons: ActionButtonConfig[];
  handler: (event: {type: string, data: any}) => void;
}

export interface TableEmptyState {
  icon: string;
  message: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, ActionButtonsGroupComponent],
  template: `
    <div class="table-container">
      <table class="data-table" *ngIf="data.length > 0; else emptyTemplate">
        <thead>
          <tr>
            <th 
              *ngFor="let column of columns" 
              [style.width]="column.width"
              [class.sortable]="column.sortable">
              {{ column.header }}
            </th>
            <th *ngIf="hasActions" class="actions-column">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of data; trackBy: trackByFn">
            <td *ngFor="let column of columns">
              <ng-container [ngSwitch]="column.type || 'text'">
                
                <!-- Texto simples -->
                <span *ngSwitchCase="'text'">
                  {{ column.formatter ? column.formatter(getNestedProperty(item, column.key), item) : getNestedProperty(item, column.key) }}
                </span>
                
                <!-- Imagem -->
                <div *ngSwitchCase="'image'" class="table-image">
                  <img 
                    *ngIf="getNestedProperty(item, column.imageProperty || column.key); else imagePlaceholder" 
                    [src]="getNestedProperty(item, column.imageProperty || column.key)" 
                    [alt]="getNestedProperty(item, column.imageAlt || 'name')" 
                    (error)="$event.target.style.display='none'">
                  <ng-template #imagePlaceholder>
                    <i [class]="column.imagePlaceholder || 'pi pi-image'"></i>
                  </ng-template>
                </div>
                
                <!-- Badge/Status -->
                <span *ngSwitchCase="'badge'" 
                      class="status-badge" 
                      [ngClass]="column.badgeClass ? column.badgeClass(getNestedProperty(item, column.key), item) : getNestedProperty(item, column.key).toLowerCase()">
                  {{ column.formatter ? column.formatter(getNestedProperty(item, column.key), item) : getNestedProperty(item, column.key) }}
                </span>
                
                <!-- Data -->
                <span *ngSwitchCase="'date'">
                  {{ column.formatter ? column.formatter(getNestedProperty(item, column.key), item) : formatDate(getNestedProperty(item, column.key)) }}
                </span>
                
                <!-- Cat info (gato com foto e nome) -->
                <div *ngSwitchCase="'cat-info'" class="cat-info">
                  <img 
                    *ngIf="getNestedProperty(item, 'photoUrl'); else catMiniPlaceholder" 
                    [src]="getNestedProperty(item, 'photoUrl')" 
                    [alt]="getNestedProperty(item, 'cat')" 
                    class="cat-mini-photo"
                    (error)="$event.target.style.display='none'">
                  <ng-template #catMiniPlaceholder>
                    <div class="cat-mini-photo placeholder">
                      <i class="pi pi-image"></i>
                    </div>
                  </ng-template>
                  <div class="cat-details">
                    <strong>{{ getNestedProperty(item, 'cat') || 'Nome não disponível' }}</strong>
                  </div>
                </div>

                <!-- Notes truncadas -->
                <span *ngSwitchCase="'notes'" [title]="getNestedProperty(item, column.key)">
                  {{ (getNestedProperty(item, column.key) || '-') | slice:0:50 }}
                  <span *ngIf="getNestedProperty(item, column.key) && getNestedProperty(item, column.key).length > 50">...</span>
                </span>
                
                <!-- Conteúdo customizado -->
                <ng-container *ngSwitchCase="'custom'">
                  <ng-container 
                    *ngTemplateOutlet="column.customTemplate; context: { $implicit: item, value: getNestedProperty(item, column.key) }">
                  </ng-container>
                </ng-container>
                
              </ng-container>
            </td>
            
            <!-- Coluna de ações -->
            <td *ngIf="hasActions">
              <app-action-buttons-group
                [buttons]="getItemActions(item)"
                [data]="item"
                (buttonClick)="onActionClick($event)">
              </app-action-buttons-group>
            </td>
          </tr>
        </tbody>
      </table>

      <ng-template #emptyTemplate>
        <div class="empty-message">
          <i [class]="emptyState.icon"></i>
          <p>{{ emptyState.message }}</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .table-container {
      width: 100%;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .data-table th {
      background: var(--p-surface-ground);
      color: var(--p-text-color);
      font-weight: 600;
      padding: 1rem;
      text-align: left;
      border-bottom: 2px solid var(--p-surface-border);
    }

    .data-table th.sortable {
      cursor: pointer;
      user-select: none;
      position: relative;
    }

    .data-table th.sortable:hover {
      background: var(--p-surface-hover);
    }

    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid var(--p-surface-border);
      vertical-align: middle;
    }

    .data-table tbody tr {
      transition: background-color 0.2s;
    }

    .data-table tbody tr:hover {
      background: var(--p-surface-hover);
    }

    .data-table tbody tr:nth-child(even) {
      background: rgba(0, 0, 0, 0.02);
    }

    .data-table tbody tr:nth-child(even):hover {
      background: var(--p-surface-hover);
    }

    .actions-column {
      width: 120px;
      text-align: center;
    }

    /* Estilos para imagens */
    .table-image {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      overflow: hidden;
      background: var(--p-surface-ground);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .table-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .table-image i {
      font-size: 1.5rem;
      color: var(--p-text-color-secondary);
    }

    /* Estilos para badges */
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 1px solid transparent;
    }

    .status-badge.eligible {
      background-color: #d1fae5;
      color: #065f46;
      border-color: #a7f3d0;
    }

    .status-badge.overdue {
      background-color: #fee2e2;
      color: #991b1b;
      border-color: #fca5a5;
    }

    .status-badge.scheduled {
      background-color: #dbeafe;
      color: #1e40af;
      border-color: #93c5fd;
    }

    .status-badge.completed {
      background-color: #d1fae5;
      color: #065f46;
      border-color: #a7f3d0;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .status-badge.completed i {
      font-size: 0.75rem;
    }

    .status-badge.canceled {
      background-color: #fee2e2;
      color: #991b1b;
      border-color: #fca5a5;
    }

    /* Estilos para cat-info */
    .cat-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .cat-mini-photo {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      object-fit: cover;
      background: var(--p-surface-ground);
    }

    .cat-mini-photo.placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--p-text-color-secondary);
      font-size: 1rem;
    }

    .cat-details {
      display: flex;
      flex-direction: column;
    }

    .cat-details strong {
      color: var(--p-text-color);
      font-weight: 600;
    }

    /* Mensagem de estado vazio */
    .empty-message {
      text-align: center;
      padding: 2rem;
      color: var(--p-text-color-secondary);
    }

    .empty-message i {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
      color: var(--p-text-color-muted);
    }

    .empty-message p {
      margin: 0;
      font-size: 1.1rem;
    }

    /* Responsividade */
    @media (max-width: 768px) {
      .data-table {
        font-size: 0.875rem;
      }

      .data-table th,
      .data-table td {
        padding: 0.5rem;
      }
    }

    @media (max-width: 480px) {
      .data-table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
      }
    }
  `]
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() emptyState: TableEmptyState = {
    icon: 'pi pi-info-circle',
    message: 'Nenhum dado encontrado'
  };
  @Input() actionProvider?: (item: any) => ActionButtonConfig[];
  @Input() trackByProperty?: string;

  @Output() actionClick = new EventEmitter<{type: string, data: any}>();
  @Output() sortChange = new EventEmitter<{column: string, direction: 'asc' | 'desc'}>();

  get hasActions(): boolean {
    return !!this.actionProvider;
  }

  trackByFn = (index: number, item: any): any => {
    if (this.trackByProperty && item[this.trackByProperty]) {
      return item[this.trackByProperty];
    }
    return index;
  }

  getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getItemActions(item: any): ActionButtonConfig[] {
    return this.actionProvider ? this.actionProvider(item) : [];
  }

  onActionClick(event: {type: string, data: any}): void {
    this.actionClick.emit(event);
  }
}
