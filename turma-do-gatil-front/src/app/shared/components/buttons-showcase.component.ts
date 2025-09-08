import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  RefreshButtonComponent,
  ActionButtonComponent,
  ActionButtonsGroupComponent,
  ActionButtonConfig
} from './index';

// Componente de demonstração de todos os tipos de botões
@Component({
  selector: 'app-buttons-showcase',
  standalone: true,
  imports: [
    CommonModule,
    RefreshButtonComponent,
    ActionButtonComponent,
    ActionButtonsGroupComponent
  ],
  template: `
    <div class="showcase-container">
      <h2>Showcase dos Componentes de Botões</h2>
      
      <!-- Botão de Atualizar -->
      <section class="showcase-section">
        <h3>Botão de Atualizar</h3>
        <div class="button-examples">
          <div class="example">
            <label>Normal:</label>
            <app-refresh-button 
              [loading]="false"
              (refresh)="onRefresh('normal')">
            </app-refresh-button>
          </div>
          
          <div class="example">
            <label>Carregando:</label>
            <app-refresh-button 
              [loading]="true"
              (refresh)="onRefresh('loading')">
            </app-refresh-button>
          </div>
          
          <div class="example">
            <label>Personalizado:</label>
            <app-refresh-button 
              [loading]="false"
              [label]="'Recarregar Dados'"
              (refresh)="onRefresh('custom')">
            </app-refresh-button>
          </div>
        </div>
      </section>

      <!-- Botões de Ação Individuais -->
      <section class="showcase-section">
        <h3>Botões de Ação Individuais</h3>
        <div class="button-examples">
          <div class="example" *ngFor="let config of singleButtonConfigs">
            <label>{{ config.tooltip }}:</label>
            <app-action-button
              [config]="config"
              [data]="sampleData"
              (action)="onSingleAction($event)">
            </app-action-button>
          </div>
        </div>
      </section>

      <!-- Grupos de Botões -->
      <section class="showcase-section">
        <h3>Grupos de Botões de Ação</h3>
        
        <div class="example">
          <label>Ações de CRUD:</label>
          <app-action-buttons-group
            [buttons]="crudButtons"
            [data]="sampleData"
            (buttonClick)="onGroupAction($event)">
          </app-action-buttons-group>
        </div>
        
        <div class="example">
          <label>Ações de Agendamento:</label>
          <app-action-buttons-group
            [buttons]="scheduleButtons"
            [data]="sampleData"
            (buttonClick)="onGroupAction($event)">
          </app-action-buttons-group>
        </div>
        
        <div class="example">
          <label>Ações com Estados:</label>
          <app-action-buttons-group
            [buttons]="conditionalButtons"
            [data]="sampleData"
            (buttonClick)="onGroupAction($event)">
          </app-action-buttons-group>
        </div>
      </section>

      <!-- Log de Ações -->
      <section class="showcase-section">
        <h3>Log de Ações</h3>
        <div class="action-log">
          <div *ngFor="let log of actionLog" class="log-entry">
            <span class="timestamp">{{ log.timestamp | date:'HH:mm:ss' }}</span>
            <span class="action">{{ log.action }}</span>
            <span class="data">{{ log.data | json }}</span>
          </div>
          <div *ngIf="actionLog.length === 0" class="no-logs">
            Nenhuma ação executada ainda.
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .showcase-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .showcase-container h2 {
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }

    .showcase-section {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .showcase-section h3 {
      color: #555;
      margin-bottom: 1rem;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 0.5rem;
    }

    .button-examples {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .example {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: #f9f9f9;
    }

    .example label {
      font-weight: 600;
      color: #666;
      font-size: 0.875rem;
    }

    .action-log {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 1rem;
      max-height: 300px;
      overflow-y: auto;
    }

    .log-entry {
      display: grid;
      grid-template-columns: auto auto 1fr;
      gap: 1rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #dee2e6;
      font-family: monospace;
      font-size: 0.875rem;
    }

    .log-entry:last-child {
      border-bottom: none;
    }

    .timestamp {
      color: #6c757d;
      font-weight: 600;
    }

    .action {
      color: #495057;
      font-weight: 600;
    }

    .data {
      color: #343a40;
      word-break: break-all;
    }

    .no-logs {
      text-align: center;
      color: #6c757d;
      font-style: italic;
      padding: 2rem;
    }
  `]
})
export class ButtonsShowcaseComponent {
  sampleData = {
    id: 1,
    name: 'Item de Exemplo',
    status: 'PENDING'
  };

  actionLog: Array<{timestamp: Date, action: string, data: any}> = [];

  // Configurações para botões individuais
  singleButtonConfigs: ActionButtonConfig[] = [
    {
      type: 'schedule',
      tooltip: 'Agendar'
    },
    {
      type: 'edit',
      tooltip: 'Editar'
    },
    {
      type: 'complete',
      tooltip: 'Completar'
    },
    {
      type: 'cancel',
      tooltip: 'Cancelar'
    },
    {
      type: 'info',
      tooltip: 'Informações'
    }
  ];

  // Botões de CRUD
  crudButtons: ActionButtonConfig[] = [
    {
      type: 'edit',
      tooltip: 'Editar registro'
    },
    {
      type: 'cancel',
      tooltip: 'Excluir registro'
    }
  ];

  // Botões de agendamento
  scheduleButtons: ActionButtonConfig[] = [
    {
      type: 'schedule',
      tooltip: 'Agendar consulta'
    },
    {
      type: 'edit',
      tooltip: 'Editar agendamento'
    },
    {
      type: 'complete',
      tooltip: 'Marcar como realizado'
    },
    {
      type: 'cancel',
      tooltip: 'Cancelar agendamento'
    }
  ];

  // Botões condicionais (alguns desabilitados)
  conditionalButtons: ActionButtonConfig[] = [
    {
      type: 'edit',
      tooltip: 'Editar (sempre disponível)'
    },
    {
      type: 'complete',
      tooltip: 'Completar (desabilitado)',
      disabled: true
    },
    {
      type: 'info',
      tooltip: 'Informações (oculto)',
      visible: false
    },
    {
      type: 'cancel',
      tooltip: 'Cancelar (disponível)'
    }
  ];

  onRefresh(type: string) {
    this.logAction(`Refresh ${type}`, { type });
  }

  onSingleAction(data: any) {
    this.logAction('Single Action', data);
  }

  onGroupAction(event: {type: string, data: any}) {
    this.logAction(`Group Action - ${event.type}`, event.data);
  }

  private logAction(action: string, data: any) {
    this.actionLog.unshift({
      timestamp: new Date(),
      action,
      data
    });

    // Manter apenas os últimos 20 logs
    if (this.actionLog.length > 20) {
      this.actionLog = this.actionLog.slice(0, 20);
    }
  }
}
