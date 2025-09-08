import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  PageHeaderComponent,
  StatsGridComponent,
  ContentCardComponent,
  StatCardData,
  RefreshButtonComponent,
  ActionButtonsGroupComponent,
  PaginationComponent,
  ActionButtonConfig,
  PaginationInfo
} from '../../shared/components';

// Exemplo de como usar os componentes de cards em outros lugares da aplicação
@Component({
  selector: 'app-cards-example',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    StatsGridComponent,
    ContentCardComponent,
    RefreshButtonComponent,
    ActionButtonsGroupComponent,
    PaginationComponent
  ],
  template: `
    <div class="page-container">
      <!-- Header da página -->
      <app-page-header
        title="Exemplo de Cards"
        subtitle="Demonstração dos componentes de cards reutilizáveis"
        icon="pi-objects-column">
      </app-page-header>

      <!-- Grid de estatísticas -->
      <app-stats-grid [stats]="getStatsData()"></app-stats-grid>

      <!-- Card de conteúdo simples -->
      <app-content-card
        title="Card Simples"
        icon="pi-info-circle">
        <p>Este é um exemplo de card de conteúdo simples sem ações ou footer.</p>
        <p>Pode conter qualquer tipo de conteúdo HTML.</p>
      </app-content-card>

      <!-- Card com ações -->
      <app-content-card
        title="Card com Ações"
        icon="pi-cog"
        [hasActions]="true">
        
        <div slot="actions">
          <app-refresh-button 
            [loading]="loading"
            [label]="'Recarregar'"
            (refresh)="onRefresh()">
          </app-refresh-button>
          <button class="p-button p-button-sm p-button-secondary">
            <i class="pi pi-plus"></i>
            Adicionar
          </button>
        </div>

        <div class="table-container">
          <table class="example-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of sampleData">
                <td>{{ item.name }}</td>
                <td>
                  <span class="status-badge" [ngClass]="item.status.toLowerCase()">
                    {{ item.status }}
                  </span>
                </td>
                <td>
                  <app-action-buttons-group
                    [buttons]="getActionButtons(item)"
                    [data]="item"
                    (buttonClick)="onActionClick($event)">
                  </app-action-buttons-group>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-content-card>

      <!-- Card com footer (paginação) -->
      <app-content-card
        title="Card com Paginação"
        icon="pi-table"
        [hasActions]="true"
        [hasFooter]="true">
        
        <div slot="actions">
          <app-refresh-button 
            [loading]="false"
            (refresh)="onRefresh()">
          </app-refresh-button>
        </div>

        <div class="content-area">
          <p>Conteúdo da tabela ou lista que precisa de paginação.</p>
          <div class="mock-data">
            <div *ngFor="let i of [1,2,3,4,5]" class="mock-item">
              Item {{ i }} da página atual
            </div>
          </div>
        </div>

        <div slot="footer">
          <app-pagination
            [pagination]="getPaginationInfo()"
            (pageChange)="onPageChange($event)"
            (previousPage)="onPreviousPage()"
            (nextPage)="onNextPage()">
          </app-pagination>
        </div>
      </app-content-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1rem;
    }

    .table-container {
      width: 100%;
    }

    .example-table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .example-table th {
      background: var(--p-surface-ground, #f9fafb);
      color: var(--p-text-color, #1f2937);
      font-weight: 600;
      padding: 1rem;
      text-align: left;
      border-bottom: 2px solid var(--p-surface-border, #e5e7eb);
    }

    .example-table td {
      padding: 1rem;
      border-bottom: 1px solid var(--p-surface-border, #e5e7eb);
      vertical-align: middle;
    }

    .example-table tbody tr:hover {
      background: var(--p-surface-hover, #f3f4f6);
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.active {
      background-color: #d1fae5;
      color: #065f46;
    }

    .status-badge.inactive {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .content-area {
      min-height: 200px;
    }

    .mock-data {
      margin-top: 1rem;
    }

    .mock-item {
      padding: 0.5rem;
      border: 1px solid var(--p-surface-border, #e5e7eb);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--p-surface-ground, #f9fafb);
    }

    .p-button {
      background: var(--p-primary-color, #F2BBAE);
      border: 1px solid var(--p-primary-color, #F2BBAE);
      color: white;
      padding: 0.5rem 0.875rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      text-decoration: none;
      font-size: 0.875rem;
    }

    .p-button:hover {
      background: var(--p-primary-600, #E5A898);
      border-color: var(--p-primary-600, #E5A898);
      transform: translateY(-1px);
    }

    .p-button-secondary {
      background: var(--p-surface-100, #f9fafb);
      border-color: var(--p-surface-300, #d1d5db);
      color: var(--p-text-color, #1f2937);
    }

    .p-button-secondary:hover {
      background: var(--p-surface-hover, #f3f4f6);
      border-color: var(--p-primary-color, #F2BBAE);
    }
  `]
})
export class CardsExampleComponent {
  loading = false;
  currentPage = 0;
  
  sampleData = [
    { id: 1, name: 'Item A', status: 'ACTIVE' },
    { id: 2, name: 'Item B', status: 'INACTIVE' },
    { id: 3, name: 'Item C', status: 'ACTIVE' }
  ];

  mockPagination = {
    totalElements: 50,
    numberOfElements: 5,
    first: true,
    last: false,
    totalPages: 10,
    currentPage: 0
  };

  getStatsData(): StatCardData[] {
    return [
      {
        number: 125,
        label: 'Total de Itens',
        description: 'Todos os registros',
        icon: 'pi-database',
        type: 'primary'
      },
      {
        number: 95,
        label: 'Itens Ativos',
        description: 'Em funcionamento',
        icon: 'pi-check-circle',
        type: 'success'
      },
      {
        number: 30,
        label: 'Pendentes',
        description: 'Aguardando aprovação',
        icon: 'pi-clock',
        type: 'warning'
      },
      {
        number: 5,
        label: 'Com Problemas',
        description: 'Requerem atenção',
        icon: 'pi-exclamation-triangle',
        type: 'overdue'
      }
    ];
  }

  getActionButtons(item: any): ActionButtonConfig[] {
    return [
      {
        type: 'edit',
        tooltip: `Editar ${item.name}`
      },
      {
        type: 'cancel',
        tooltip: 'Remover item'
      }
    ];
  }

  onRefresh() {
    console.log('Refreshing data...');
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      console.log('Data refreshed!');
    }, 2000);
  }

  onActionClick(event: {type: string, data: any}) {
    console.log('Action clicked:', event.type, event.data);
  }

  getPaginationInfo(): PaginationInfo {
    return {
      totalElements: this.mockPagination.totalElements,
      numberOfElements: this.mockPagination.numberOfElements,
      first: this.mockPagination.first,
      last: this.mockPagination.last,
      totalPages: this.mockPagination.totalPages,
      currentPage: this.currentPage
    };
  }

  onPageChange(page: number) {
    console.log('Page changed to:', page);
    this.currentPage = page;
  }

  onPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      console.log('Previous page:', this.currentPage);
    }
  }

  onNextPage() {
    if (this.currentPage < this.mockPagination.totalPages - 1) {
      this.currentPage++;
      console.log('Next page:', this.currentPage);
    }
  }
}
