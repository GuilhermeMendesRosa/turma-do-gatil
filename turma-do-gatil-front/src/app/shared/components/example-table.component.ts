import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  RefreshButtonComponent,
  ActionButtonsGroupComponent,
  PaginationComponent,
  ActionButtonConfig,
  PaginationInfo
} from '../../shared/components';

// Exemplo de como usar os componentes em outros lugares da aplicação
@Component({
  selector: 'app-example-table',
  standalone: true,
  imports: [
    CommonModule,
    RefreshButtonComponent,
    ActionButtonsGroupComponent,
    PaginationComponent
  ],
  template: `
    <div class="content-card">
      <div class="card-header">
        <h3><i class="pi pi-table"></i> Tabela de Exemplo</h3>
        <div class="actions">
          <app-refresh-button 
            [loading]="loading"
            [label]="'Atualizar Dados'"
            (refresh)="onRefresh()">
          </app-refresh-button>
        </div>
      </div>
      
      <div class="table-container" *ngIf="!loading; else loadingTemplate">
        <table class="example-table" *ngIf="items.length > 0; else emptyMessage">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Status</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of items">
              <td>{{ item.name }}</td>
              <td>
                <span class="status-badge" [ngClass]="item.status.toLowerCase()">
                  {{ item.status }}
                </span>
              </td>
              <td>{{ item.date | date:'dd/MM/yyyy' }}</td>
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

        <ng-template #emptyMessage>
          <div class="empty-message">
            <i class="pi pi-info-circle"></i>
            <p>Nenhum item encontrado.</p>
          </div>
        </ng-template>
      </div>

      <!-- Paginação -->
      <app-pagination
        [pagination]="getPaginationInfo()"
        (pageChange)="onPageChange($event)"
        (previousPage)="onPreviousPage()"
        (nextPage)="onNextPage()">
      </app-pagination>

      <ng-template #loadingTemplate>
        <div class="loading-message">
          <i class="pi pi-spinner"></i>
          Carregando...
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .content-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .card-header h3 {
      margin: 0;
      color: #333;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .table-container {
      padding: 1rem;
    }

    .example-table {
      width: 100%;
      border-collapse: collapse;
    }

    .example-table th,
    .example-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    .example-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-badge.active {
      background-color: #d4edda;
      color: #155724;
    }

    .status-badge.inactive {
      background-color: #f8d7da;
      color: #721c24;
    }

    .status-badge.pending {
      background-color: #fff3cd;
      color: #856404;
    }

    .empty-message {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .empty-message i {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      display: block;
    }

    .loading-message {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .loading-message i {
      font-size: 1.5rem;
      margin-right: 0.5rem;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class ExampleTableComponent {
  loading = false;
  currentPage = 0;
  pageSize = 10;
  
  // Dados de exemplo
  items = [
    { id: 1, name: 'Item 1', status: 'ACTIVE', date: new Date() },
    { id: 2, name: 'Item 2', status: 'INACTIVE', date: new Date() },
    { id: 3, name: 'Item 3', status: 'PENDING', date: new Date() }
  ];

  // Simulação de dados de paginação
  paginationData = {
    totalElements: 25,
    numberOfElements: 3,
    first: true,
    last: false,
    totalPages: 9,
    currentPage: 0,
    pageSize: 10
  };

  // Configuração dos botões de ação baseada no item
  getActionButtons(item: any): ActionButtonConfig[] {
    const buttons: ActionButtonConfig[] = [
      {
        type: 'edit',
        tooltip: `Editar ${item.name}`
      }
    ];

    // Adicionar botão de completar apenas para itens pendentes
    if (item.status === 'PENDING') {
      buttons.push({
        type: 'complete',
        tooltip: 'Marcar como concluído'
      });
    }

    // Adicionar botão de cancelar apenas para itens ativos
    if (item.status === 'ACTIVE') {
      buttons.push({
        type: 'cancel',
        tooltip: 'Desativar item'
      });
    }

    return buttons;
  }

  // Handler para ações dos botões
  onActionClick(event: {type: string, data: any}) {
    console.log('Ação:', event.type, 'Item:', event.data);
    
    switch (event.type) {
      case 'edit':
        this.editItem(event.data);
        break;
      case 'complete':
        this.completeItem(event.data);
        break;
      case 'cancel':
        this.cancelItem(event.data);
        break;
    }
  }

  // Métodos de ação
  editItem(item: any) {
    console.log('Editando item:', item);
    // Implementar lógica de edição
  }

  completeItem(item: any) {
    console.log('Completando item:', item);
    // Atualizar status do item
    item.status = 'ACTIVE';
  }

  cancelItem(item: any) {
    console.log('Cancelando item:', item);
    // Atualizar status do item
    item.status = 'INACTIVE';
  }

  // Atualizar dados
  onRefresh() {
    console.log('Atualizando dados...');
    this.loading = true;
    
    // Simular carregamento
    setTimeout(() => {
      this.loading = false;
      console.log('Dados atualizados!');
    }, 2000);
  }

  // Informações de paginação
  getPaginationInfo(): PaginationInfo {
    return {
      totalElements: this.paginationData.totalElements,
      numberOfElements: this.paginationData.numberOfElements,
      first: this.paginationData.first,
      last: this.paginationData.last,
      totalPages: this.paginationData.totalPages,
      currentPage: this.currentPage,
      pageSize: this.paginationData.pageSize
    };
  }

  // Navegação de página
  onPageChange(page: number) {
    console.log('Mudando para página:', page);
    this.currentPage = page;
    // Implementar carregamento da nova página
  }

  onPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      console.log('Página anterior:', this.currentPage);
      // Implementar carregamento da página anterior
    }
  }

  onNextPage() {
    if (this.currentPage < this.paginationData.totalPages - 1) {
      this.currentPage++;
      console.log('Próxima página:', this.currentPage);
      // Implementar carregamento da próxima página
    }
  }
}
