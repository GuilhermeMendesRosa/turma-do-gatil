import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenericModalComponent, ModalAction } from '../../shared/components';

@Component({
  selector: 'app-example-generic-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GenericModalComponent
  ],
  template: `
    <!-- Exemplo 1: Modal simples com confirmação -->
    <button (click)="showConfirmModal = true" class="btn-primary">
      Abrir Modal de Confirmação
    </button>

    <app-generic-modal
      [(visible)]="showConfirmModal"
      title="Confirmar Ação"
      [actions]="confirmActions">
      
      <div class="modal-content">
        <p>Tem certeza de que deseja realizar esta ação?</p>
        <p class="text-muted">Esta ação não pode ser desfeita.</p>
      </div>
    </app-generic-modal>

    <!-- Exemplo 2: Modal com formulário -->
    <button (click)="showFormModal = true" class="btn-secondary">
      Abrir Modal com Formulário
    </button>

    <app-generic-modal
      [(visible)]="showFormModal"
      title="Adicionar Item"
      [actions]="formActions"
      [dialogStyle]="{ width: '80vw', maxWidth: '500px' }">
      
      <form class="form-example">
        <div class="form-field">
          <label for="itemName">Nome do Item</label>
          <input 
            type="text" 
            id="itemName" 
            [(ngModel)]="formData.name"
            class="form-input"
            placeholder="Digite o nome do item">
        </div>
        
        <div class="form-field">
          <label for="itemDescription">Descrição</label>
          <textarea 
            id="itemDescription" 
            [(ngModel)]="formData.description"
            class="form-textarea"
            rows="3"
            placeholder="Digite a descrição do item">
          </textarea>
        </div>
      </form>
    </app-generic-modal>

    <!-- Exemplo 3: Modal de informações -->
    <button (click)="showInfoModal = true" class="btn-info">
      Abrir Modal de Informações
    </button>

    <app-generic-modal
      [(visible)]="showInfoModal"
      title="Informações do Sistema"
      [actions]="infoActions"
      styleClass="info-modal">
      
      <div class="info-content">
        <div class="info-item">
          <i class="pi pi-info-circle"></i>
          <div>
            <h4>Versão do Sistema</h4>
            <p>v1.0.0</p>
          </div>
        </div>
        
        <div class="info-item">
          <i class="pi pi-calendar"></i>
          <div>
            <h4>Última Atualização</h4>
            <p>{{ currentDate | date:'short' }}</p>
          </div>
        </div>
        
        <div class="info-item">
          <i class="pi pi-users"></i>
          <div>
            <h4>Usuários Ativos</h4>
            <p>125 usuários</p>
          </div>
        </div>
      </div>
    </app-generic-modal>
  `,
  styles: [`
    .btn-primary, .btn-secondary, .btn-info {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin: 0.5rem;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--p-primary-color);
      color: white;
    }

    .btn-secondary {
      background: var(--p-surface-500);
      color: white;
    }

    .btn-info {
      background: var(--p-blue-500);
      color: white;
    }

    .modal-content {
      text-align: center;
      padding: 1rem;
    }

    .text-muted {
      color: var(--p-text-color-secondary);
      font-size: 0.9rem;
    }

    .form-example {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-field label {
      font-weight: 500;
      color: var(--p-text-color);
    }

    .form-input, .form-textarea {
      padding: 0.75rem;
      border: 1px solid var(--p-surface-border);
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
      font-family: inherit;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      background: var(--p-surface-section);
      border-radius: 8px;
    }

    .info-item i {
      font-size: 1.5rem;
      color: var(--p-primary-color);
    }

    .info-item h4 {
      margin: 0;
      font-size: 1rem;
      color: var(--p-text-color);
    }

    .info-item p {
      margin: 0.25rem 0 0 0;
      color: var(--p-text-color-secondary);
      font-size: 0.9rem;
    }
  `]
})
export class ExampleGenericModalComponent {
  showConfirmModal = false;
  showFormModal = false;
  showInfoModal = false;
  
  formData = {
    name: '',
    description: ''
  };

  currentDate = new Date();

  // Ações do modal de confirmação
  get confirmActions(): ModalAction[] {
    return [
      {
        label: 'Cancelar',
        icon: 'pi pi-times',
        severity: 'secondary',
        outlined: true,
        action: () => this.showConfirmModal = false
      },
      {
        label: 'Confirmar',
        icon: 'pi pi-check',
        severity: 'danger',
        action: () => {
          // Aqui você implementaria a lógica da ação
          console.log('Ação confirmada!');
          this.showConfirmModal = false;
        }
      }
    ];
  }

  // Ações do modal de formulário
  get formActions(): ModalAction[] {
    return [
      {
        label: 'Cancelar',
        icon: 'pi pi-times',
        severity: 'secondary',
        outlined: true,
        action: () => {
          this.formData = { name: '', description: '' };
          this.showFormModal = false;
        }
      },
      {
        label: 'Salvar',
        icon: 'pi pi-save',
        disabled: !this.formData.name.trim(),
        action: () => {
          // Aqui você implementaria a lógica de salvamento
          console.log('Dados salvos:', this.formData);
          this.formData = { name: '', description: '' };
          this.showFormModal = false;
        }
      }
    ];
  }

  // Ações do modal de informações
  get infoActions(): ModalAction[] {
    return [
      {
        label: 'Fechar',
        icon: 'pi pi-times',
        action: () => this.showInfoModal = false
      }
    ];
  }
}
