# Componentes de Cards - Documentação

## 📋 Componentes Criados

Esta documentação descreve os componentes de cards criados para reutilização em toda a aplicação.

### 1. PageHeaderComponent

Componente para criar cabeçalhos padronizados de páginas.

**Uso:**
```html
<app-page-header
  title="Título da Página"
  subtitle="Descrição opcional da página"
  icon="pi-nome-do-icone">
</app-page-header>
```

**Propriedades:**
- `title: string` - Título principal da página (obrigatório)
- `subtitle?: string` - Subtítulo/descrição opcional
- `icon?: string` - Classe do ícone PrimeIcons (opcional)

### 2. StatCardComponent

Componente para exibir estatísticas em formato de card.

**Uso:**
```html
<app-stat-card [data]="statData"></app-stat-card>
```

**Tipos disponíveis:**
- `eligible` - Verde, para dados positivos
- `overdue` - Vermelho, para alertas/problemas
- `success` - Verde claro, para sucessos
- `warning` - Amarelo, para avisos
- `info` - Azul, para informações
- `primary` - Cor primária da aplicação

**Exemplo de dados:**
```typescript
const statData: StatCardData = {
  number: 42,
  label: 'Total de Itens',
  description: 'Descrição adicional',
  icon: 'pi-database',
  type: 'primary'
};
```

### 3. StatsGridComponent

Componente que organiza múltiplos StatCards em uma grade responsiva.

**Uso:**
```html
<app-stats-grid [stats]="statsArray"></app-stats-grid>
```

**Exemplo:**
```typescript
getStatsData(): StatCardData[] {
  return [
    {
      number: 125,
      label: 'Total',
      description: 'Todos os registros',
      icon: 'pi-database',
      type: 'primary'
    },
    {
      number: 95,
      label: 'Ativos',
      description: 'Em funcionamento',
      icon: 'pi-check-circle',
      type: 'success'
    }
  ];
}
```

### 4. ContentCardComponent

Componente principal para cards de conteúdo com suporte a ações e footer.

**Uso:**
```html
<app-content-card
  title="Título do Card"
  icon="pi-table"
  [hasActions]="true"
  [hasFooter]="true">
  
  <div slot="actions">
    <!-- Botões de ação -->
    <app-refresh-button (refresh)="onRefresh()"></app-refresh-button>
  </div>

  <!-- Conteúdo principal -->
  <div class="table-container">
    <table>...</table>
  </div>

  <div slot="footer">
    <!-- Footer (ex: paginação) -->
    <app-pagination ...></app-pagination>
  </div>
</app-content-card>
```

**Propriedades:**
- `title: string` - Título do card (obrigatório)
- `icon?: string` - Ícone para o título (opcional)
- `hasActions: boolean` - Se deve mostrar área de ações (padrão: false)
- `hasFooter: boolean` - Se deve mostrar footer (padrão: false)

**Slots disponíveis:**
- `slot="actions"` - Área para botões de ação no header
- Conteúdo principal (sem slot)
- `slot="footer"` - Área do footer (geralmente paginação)

## 🎨 Estilização

Todos os componentes seguem o design system da aplicação:

### Cores Utilizadas
```css
--p-primary-color: #F2BBAE
--p-surface-card: #ffffff
--p-surface-border: #e5e7eb
--p-text-color: #1f2937
--p-text-color-secondary: #6b7280
```

### Características Visuais
- **Border-radius:** 12px para cards principais, 8px para elementos internos
- **Shadows:** Sombras suaves com a cor primária
- **Hover effects:** Elevação com `translateY(-4px)`
- **Transições:** `0.2s ease` para animações suaves
- **Responsividade:** Adaptação automática para mobile

## 📱 Responsividade

### Breakpoints
- **Desktop:** Layout completo
- **768px:** Ajustes nos headers e grades
- **480px:** Layout simplificado, elementos empilhados

### Grid de Estatísticas
- **Desktop:** `repeat(auto-fit, minmax(280px, 1fr))`
- **Mobile:** `1fr` (uma coluna)

## 🔄 Exemplo Completo

```typescript
// component.ts
@Component({
  selector: 'app-my-page',
  imports: [
    PageHeaderComponent,
    StatsGridComponent,
    ContentCardComponent,
    RefreshButtonComponent,
    PaginationComponent
  ]
})
export class MyPageComponent {
  loading = false;
  
  getStatsData(): StatCardData[] {
    return [
      {
        number: 150,
        label: 'Total de Registros',
        description: 'Todos os itens cadastrados',
        icon: 'pi-database',
        type: 'primary'
      },
      {
        number: 25,
        label: 'Pendentes',
        description: 'Aguardando processamento',
        icon: 'pi-clock',
        type: 'warning'
      }
    ];
  }

  onRefresh() {
    this.loading = true;
    // Lógica de atualização
    setTimeout(() => this.loading = false, 2000);
  }
}
```

```html
<!-- component.html -->
<div class="page-container">
  <app-page-header
    title="Minha Página"
    subtitle="Gerenciamento de dados"
    icon="pi-cog">
  </app-page-header>

  <app-stats-grid [stats]="getStatsData()"></app-stats-grid>

  <app-content-card
    title="Dados da Tabela"
    icon="pi-table"
    [hasActions]="true"
    [hasFooter]="true">
    
    <div slot="actions">
      <app-refresh-button 
        [loading]="loading"
        (refresh)="onRefresh()">
      </app-refresh-button>
    </div>

    <div class="table-container">
      <!-- Sua tabela aqui -->
    </div>

    <div slot="footer">
      <app-pagination ...></app-pagination>
    </div>
  </app-content-card>
</div>
```

## ✅ Benefícios

### 1. Consistência Visual
- Design padronizado em toda aplicação
- Cores e estilos unificados
- Comportamentos previsíveis

### 2. Reutilização
- Redução significativa de código duplicado
- Facilidade para criar novas páginas
- Manutenção centralizada

### 3. Responsividade
- Adaptação automática para diferentes telas
- Layout otimizado para mobile
- UX consistente em todos os dispositivos

### 4. Flexibilidade
- Slots para conteúdo personalizado
- Configurações opcionais
- Fácil extensão e customização

## 🔧 Integração

Para usar em um novo componente:

1. Importe os componentes necessários
2. Adicione aos imports do seu componente
3. Use no template conforme a documentação
4. Customize conforme necessário

Os componentes são totalmente standalone e não requerem configuração adicional!
