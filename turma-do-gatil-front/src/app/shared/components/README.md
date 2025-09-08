# Componentes Reutilizáveis

Este documento descreve como usar os componentes de botões e paginação que foram criados para reutilização em toda a aplicação.

## Componentes Disponíveis

### 1. RefreshButtonComponent

Botão para atualizar dados com estado de carregamento.

**Uso:**
```html
<app-refresh-button 
  [loading]="isLoading"
  [label]="'Atualizar'"
  (refresh)="onRefresh()">
</app-refresh-button>
```

**Propriedades:**
- `loading: boolean` - Estado de carregamento (opcional, padrão: false)
- `label: string` - Texto do botão (opcional, padrão: 'Atualizar')

**Eventos:**
- `refresh: void` - Emitido quando o botão é clicado

### 2. ActionButtonComponent

Botão individual de ação com diferentes tipos pré-configurados.

**Uso:**
```html
<app-action-button
  [config]="buttonConfig"
  [data]="itemData"
  (action)="onAction($event)">
</app-action-button>
```

**Tipos disponíveis:**
- `schedule` - Agendar (azul, ícone calendar-plus)
- `edit` - Editar (amarelo, ícone pencil)
- `complete` - Completar (verde, ícone check)
- `cancel` - Cancelar (vermelho, ícone times)
- `info` - Informação (azul, ícone info-circle)

**Exemplo de configuração:**
```typescript
const buttonConfig: ActionButtonConfig = {
  type: 'edit',
  tooltip: 'Editar item',
  disabled: false,
  visible: true
};
```

### 3. ActionButtonsGroupComponent

Grupo de botões de ação organizados horizontalmente.

**Uso:**
```html
<app-action-buttons-group
  [buttons]="actionButtons"
  [data]="rowData"
  (buttonClick)="onButtonClick($event)">
</app-action-buttons-group>
```

**Exemplo:**
```typescript
getActionButtons(item: any): ActionButtonConfig[] {
  return [
    {
      type: 'edit',
      tooltip: `Editar ${item.name}`
    },
    {
      type: 'complete',
      tooltip: 'Marcar como concluído',
      disabled: item.status === 'COMPLETED'
    },
    {
      type: 'cancel',
      tooltip: 'Cancelar'
    }
  ];
}

onButtonClick(event: {type: string, data: any}) {
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
```

### 4. PaginationComponent

Componente de paginação completo com informações e controles.

**Uso:**
```html
<app-pagination
  [pagination]="paginationInfo"
  (pageChange)="onPageChange($event)"
  (previousPage)="onPreviousPage()"
  (nextPage)="onNextPage()">
</app-pagination>
```

**Exemplo:**
```typescript
getPaginationInfo(): PaginationInfo {
  return {
    totalElements: this.pageData.totalElements,
    numberOfElements: this.pageData.numberOfElements,
    first: this.pageData.first,
    last: this.pageData.last,
    totalPages: this.pageData.totalPages,
    currentPage: this.currentPage
  };
}

onPageChange(page: number) {
  this.currentPage = page;
  this.loadData();
}

onPreviousPage() {
  if (this.currentPage > 0) {
    this.currentPage--;
    this.loadData();
  }
}

onNextPage() {
  if (this.currentPage < this.totalPages - 1) {
    this.currentPage++;
    this.loadData();
  }
}
```

## Importação

Para usar os componentes, importe-os no seu módulo ou componente standalone:

```typescript
import { 
  RefreshButtonComponent,
  ActionButtonsGroupComponent,
  PaginationComponent,
  ActionButtonConfig,
  PaginationInfo
} from '../../shared/components';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [
    CommonModule,
    RefreshButtonComponent,
    ActionButtonsGroupComponent,
    PaginationComponent
  ],
  // ...
})
```

## Estilização

Os componentes já vêm com estilos básicos aplicados. Para personalizar:

1. **Cores dos botões:** Modifique as variáveis CSS nos componentes
2. **Espaçamento:** Use classes CSS personalizadas
3. **Tamanhos:** Os componentes respondem a variáveis CSS do PrimeNG

## Exemplo Completo

```typescript
// component.ts
export class MyTableComponent {
  items: any[] = [];
  loading = false;
  paginationData: any = {};
  currentPage = 0;

  getActionButtons(item: any): ActionButtonConfig[] {
    return [
      { type: 'edit', tooltip: `Editar ${item.name}` },
      { type: 'cancel', tooltip: 'Remover' }
    ];
  }

  onRefresh() {
    this.loading = true;
    this.loadData();
  }

  onActionClick(event: {type: string, data: any}) {
    switch (event.type) {
      case 'edit':
        this.editItem(event.data);
        break;
      case 'cancel':
        this.removeItem(event.data);
        break;
    }
  }

  getPaginationInfo(): PaginationInfo {
    return {
      totalElements: this.paginationData.totalElements,
      numberOfElements: this.paginationData.numberOfElements,
      first: this.paginationData.first,
      last: this.paginationData.last,
      totalPages: this.paginationData.totalPages,
      currentPage: this.currentPage
    };
  }
}
```

```html
<!-- component.html -->
<div class="card-header">
  <h3>Minha Tabela</h3>
  <app-refresh-button 
    [loading]="loading"
    (refresh)="onRefresh()">
  </app-refresh-button>
</div>

<table>
  <tbody>
    <tr *ngFor="let item of items">
      <td>{{ item.name }}</td>
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

<app-pagination
  [pagination]="getPaginationInfo()"
  (pageChange)="onPageChange($event)"
  (previousPage)="onPreviousPage()"
  (nextPage)="onNextPage()">
</app-pagination>
```
