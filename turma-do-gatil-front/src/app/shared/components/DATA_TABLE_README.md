# DataTable Component

Um componente de tabela genérica e reutilizável para exibir dados em formato tabular com funcionalidades avançadas.

## Características

- **Genérico e Flexível**: Pode ser usado em qualquer tela com diferentes tipos de dados
- **Tipos de Coluna Variados**: Suporte para texto, imagem, badges, datas e conteúdo customizado
- **Ações Configuráveis**: Botões de ação por linha configuráveis
- **Estados de Carregamento**: Indicador visual de carregamento
- **Estado Vazio**: Mensagem customizável quando não há dados
- **Responsivo**: Layout otimizado para diferentes tamanhos de tela
- **Tracking de Performance**: TrackBy customizável para otimização de renderização

## Uso Básico

```typescript
import { DataTableComponent, TableColumn, TableEmptyState } from '../../shared/components';

@Component({
  // ...
  imports: [DataTableComponent]
})
export class MinhaTelaComponent {
  columns: TableColumn[] = [
    {
      key: 'name',
      header: 'Nome',
      type: 'text'
    },
    {
      key: 'email',
      header: 'Email',
      type: 'text'
    }
  ];

  data = [
    { id: 1, name: 'João', email: 'joao@email.com' },
    { id: 2, name: 'Maria', email: 'maria@email.com' }
  ];

  emptyState: TableEmptyState = {
    icon: 'pi pi-info-circle',
    message: 'Nenhum dado encontrado'
  };
}
```

```html
<app-data-table
  [columns]="columns"
  [data]="data"
  [emptyState]="emptyState"
  trackByProperty="id">
</app-data-table>
```

## Configuração de Colunas

### Tipos de Coluna

#### 1. Texto Simples
```typescript
{
  key: 'name',
  header: 'Nome',
  type: 'text',
  formatter: (value, item) => value?.toUpperCase() // Opcional
}
```

#### 2. Imagem
```typescript
{
  key: 'photo',
  header: 'Foto',
  type: 'image',
  width: '80px',
  imageProperty: 'photoUrl', // Propriedade que contém a URL da imagem
  imageAlt: 'name', // Propriedade para o texto alternativo
  imagePlaceholder: 'pi pi-image' // Ícone quando não há imagem
}
```

#### 3. Badge/Status
```typescript
{
  key: 'status',
  header: 'Status',
  type: 'badge',
  formatter: (value) => this.getStatusLabel(value),
  badgeClass: (value) => value.toLowerCase() // Classe CSS para o badge
}
```

#### 4. Data
```typescript
{
  key: 'createdAt',
  header: 'Data de Criação',
  type: 'date' // Formatação automática para pt-BR
}
```

#### 5. Informações do Gato (Específico)
```typescript
{
  key: 'cat',
  header: 'Gato',
  type: 'cat-info' // Mostra foto + nome do gato
}
```

#### 6. Texto Truncado (Específico)
```typescript
{
  key: 'notes',
  header: 'Observações',
  type: 'notes' // Trunca texto em 50 caracteres
}
```

#### 7. Conteúdo Customizado
```typescript
{
  key: 'custom',
  header: 'Customizado',
  type: 'custom',
  customTemplate: this.meuTemplate // TemplateRef
}
```

## Ações por Linha

```typescript
// Método que retorna as ações para cada item
getItemActions = (item: any): ActionButtonConfig[] => {
  return [
    {
      type: 'edit',
      tooltip: 'Editar item'
    },
    {
      type: 'delete',
      tooltip: 'Excluir item'
    }
  ];
}

// Handler para as ações
onActionClick(event: {type: string, data: any}): void {
  switch (event.type) {
    case 'edit':
      this.editItem(event.data);
      break;
    case 'delete':
      this.deleteItem(event.data);
      break;
  }
}
```

```html
<app-data-table
  [actionProvider]="getItemActions"
  (actionClick)="onActionClick($event)">
</app-data-table>
```

## Propriedades

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `columns` | `TableColumn[]` | Configuração das colunas |
| `data` | `any[]` | Dados a serem exibidos |
| `loading` | `boolean` | Estado de carregamento |
| `emptyState` | `TableEmptyState` | Configuração do estado vazio |
| `actionProvider` | `(item: any) => ActionButtonConfig[]` | Função que retorna ações por item |
| `trackByProperty` | `string` | Propriedade para tracking de performance |

## Eventos

| Evento | Tipo | Descrição |
|--------|------|-----------|
| `actionClick` | `{type: string, data: any}` | Emitido quando uma ação é clicada |
| `sortChange` | `{column: string, direction: 'asc' \| 'desc'}` | Emitido quando uma coluna é ordenada |

## Estilos CSS

O componente usa variáveis CSS para temas:
- `--p-surface-ground`: Cor de fundo do cabeçalho
- `--p-text-color`: Cor do texto
- `--p-surface-border`: Cor das bordas
- `--p-surface-hover`: Cor de hover das linhas

## Exemplo Completo

```typescript
@Component({
  template: `
    <app-data-table
      [columns]="columns"
      [data]="users"
      [loading]="loading"
      [emptyState]="emptyState"
      [actionProvider]="getUserActions"
      trackByProperty="id"
      (actionClick)="onUserAction($event)">
    </app-data-table>
  `
})
export class UsersComponent {
  columns: TableColumn[] = [
    {
      key: 'avatar',
      header: 'Avatar',
      type: 'image',
      width: '60px',
      imageProperty: 'avatarUrl',
      imageAlt: 'name'
    },
    {
      key: 'name',
      header: 'Nome',
      type: 'text'
    },
    {
      key: 'email',
      header: 'Email',
      type: 'text'
    },
    {
      key: 'status',
      header: 'Status',
      type: 'badge',
      formatter: (status) => status === 'active' ? 'Ativo' : 'Inativo',
      badgeClass: (status) => status === 'active' ? 'active' : 'inactive'
    },
    {
      key: 'createdAt',
      header: 'Cadastro',
      type: 'date'
    }
  ];

  users = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      avatarUrl: 'https://example.com/avatar1.jpg'
    }
  ];

  emptyState: TableEmptyState = {
    icon: 'pi pi-users',
    message: 'Nenhum usuário encontrado'
  };

  getUserActions = (user: any): ActionButtonConfig[] => [
    { type: 'view', tooltip: 'Visualizar usuário' },
    { type: 'edit', tooltip: 'Editar usuário' },
    { type: 'delete', tooltip: 'Excluir usuário' }
  ];

  onUserAction(event: {type: string, data: any}): void {
    console.log('Ação:', event.type, 'Usuário:', event.data);
  }
}
```
