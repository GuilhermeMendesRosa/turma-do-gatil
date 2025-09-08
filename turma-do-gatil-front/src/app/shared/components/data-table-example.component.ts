import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  DataTableComponent, 
  TableColumn, 
  TableEmptyState,
  ActionButtonConfig,
  ContentCardComponent,
  PageHeaderComponent
} from './index';

interface ExampleUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  avatar?: string;
  lastLogin: string;
  notes?: string;
}

@Component({
  selector: 'app-data-table-example',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    ContentCardComponent,
    PageHeaderComponent
  ],
  template: `
    <div class="page-container">
      <app-page-header
        title="Exemplo - Tabela de Usuários"
        subtitle="Demonstração do uso do componente DataTable genérico"
        icon="pi-users">
      </app-page-header>

      <app-content-card
        title="Lista de Usuários"
        icon="pi-list"
        [hasActions]="false">
        
        <app-data-table
          [columns]="userColumns"
          [data]="users"
          [loading]="loading"
          [emptyState]="emptyState"
          [actionProvider]="getUserActions"
          trackByProperty="id"
          (actionClick)="onUserAction($event)">
        </app-data-table>
      </app-content-card>

      <!-- Exemplo com dados simples -->
      <app-content-card
        title="Tabela Simples"
        icon="pi-table"
        [hasActions]="false">
        
        <app-data-table
          [columns]="simpleColumns"
          [data]="simpleData"
          [emptyState]="simpleEmptyState">
        </app-data-table>
      </app-content-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1rem;
    }
  `]
})
export class DataTableExampleComponent {
  loading = false;

  userColumns: TableColumn[] = [
    {
      key: 'avatar',
      header: 'Avatar',
      type: 'image',
      width: '60px',
      imageProperty: 'avatar',
      imageAlt: 'name',
      imagePlaceholder: 'pi pi-user'
    },
    {
      key: 'name',
      header: 'Nome',
      type: 'text',
      formatter: (value: string) => value || 'Sem nome'
    },
    {
      key: 'email',
      header: 'Email',
      type: 'text'
    },
    {
      key: 'role',
      header: 'Função',
      type: 'text',
      formatter: (value: string) => this.getRoleLabel(value)
    },
    {
      key: 'status',
      header: 'Status',
      type: 'badge',
      formatter: (value: string) => this.getStatusLabel(value),
      badgeClass: (value: string) => value.toLowerCase()
    },
    {
      key: 'lastLogin',
      header: 'Último Acesso',
      type: 'date'
    },
    {
      key: 'notes',
      header: 'Observações',
      type: 'notes'
    }
  ];

  simpleColumns: TableColumn[] = [
    {
      key: 'id',
      header: 'ID',
      type: 'text',
      width: '80px'
    },
    {
      key: 'produto',
      header: 'Produto',
      type: 'text'
    },
    {
      key: 'preco',
      header: 'Preço',
      type: 'text',
      formatter: (value: number) => `R$ ${value.toFixed(2)}`
    },
    {
      key: 'categoria',
      header: 'Categoria',
      type: 'badge',
      badgeClass: (value: string) => value.toLowerCase().replace(' ', '-')
    }
  ];

  users: ExampleUser[] = [
    {
      id: 1,
      name: 'Ana Silva',
      email: 'ana@exemplo.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-03-15T14:30:00Z',
      notes: 'Administradora principal do sistema com acesso completo a todas as funcionalidades.'
    },
    {
      id: 2,
      name: 'Carlos Santos',
      email: 'carlos@exemplo.com',
      role: 'editor',
      status: 'active',
      lastLogin: '2024-03-14T09:15:00Z',
      notes: 'Editor responsável pelo conteúdo do blog e redes sociais.'
    },
    {
      id: 3,
      name: 'Maria Oliveira',
      email: 'maria@exemplo.com',
      role: 'viewer',
      status: 'inactive',
      lastLogin: '2024-02-20T16:45:00Z'
    }
  ];

  simpleData = [
    { id: 1, produto: 'Notebook Dell', preco: 2500.99, categoria: 'Eletrônicos' },
    { id: 2, produto: 'Mesa de Escritório', preco: 450.00, categoria: 'Móveis' },
    { id: 3, produto: 'Livro Angular', preco: 89.90, categoria: 'Livros' }
  ];

  emptyState: TableEmptyState = {
    icon: 'pi pi-users',
    message: 'Nenhum usuário encontrado'
  };

  simpleEmptyState: TableEmptyState = {
    icon: 'pi pi-shopping-cart',
    message: 'Nenhum produto cadastrado'
  };

  getUserActions = (user: ExampleUser): ActionButtonConfig[] => {
    const actions: ActionButtonConfig[] = [
      {
        type: 'info',
        tooltip: `Ver detalhes de ${user.name}`
      }
    ];

    if (user.status === 'active') {
      actions.push({
        type: 'edit',
        tooltip: 'Editar usuário'
      });
    }

    return actions;
  };

  onUserAction(event: {type: string, data: ExampleUser}): void {
    console.log('Ação executada:', event.type, 'para o usuário:', event.data.name);
    
    switch (event.type) {
      case 'info':
        alert(`Detalhes do usuário: ${event.data.name} (${event.data.email})`);
        break;
      case 'edit':
        alert(`Editando usuário: ${event.data.name}`);
        break;
    }
  }

  getRoleLabel(role: string): string {
    const roles: Record<string, string> = {
      'admin': 'Administrador',
      'editor': 'Editor',
      'viewer': 'Visualizador'
    };
    return roles[role] || role;
  }

  getStatusLabel(status: string): string {
    return status === 'active' ? 'Ativo' : 'Inativo';
  }
}
