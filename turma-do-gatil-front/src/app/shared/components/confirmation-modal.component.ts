import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericModalComponent, ModalAction } from './generic-modal.component';

export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: string;
  severity?: 'danger' | 'warning' | 'info' | 'success';
  details?: string[];
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, GenericModalComponent],
  template: `
    <app-generic-modal
      [(visible)]="visible"
      [title]="titleWithIcon"
      [actions]="modalActions"
      (hide)="onHide()"
      [styleClass]="modalStyleClass"
      ngSkipHydration>
      
      <div class="confirmation-content" style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem; margin: 1rem 0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); position: relative;">
        <!-- Ícone -->
        <div class="confirmation-icon" [ngClass]="iconClass" *ngIf="config.icon">
          <i [class]="config.icon"></i>
        </div>
        
        <!-- Mensagem principal -->
        <div class="confirmation-message">
          <p class="main-message">{{ config.message }}</p>
          
          <!-- Detalhes adicionais -->
          <div class="confirmation-details" *ngIf="config.details && config.details.length > 0">
            <ul>
              <li *ngFor="let detail of config.details">{{ detail }}</li>
            </ul>
          </div>
        </div>
      </div>
    </app-generic-modal>
  `,
  styles: [`
    /* Estilos locais do confirmation modal - sem ::ng-deep */
    /* Os estilos do p-dialog estão definidos globalmente em primeng-overrides.css */

    .confirmation-content {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background-color: var(--p-surface-0, #ffffff);
      border-radius: 8px;
      border: 1px solid var(--p-surface-border, #e5e7eb);
      margin: 0.5rem 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .confirmation-icon {
      flex-shrink: 0;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .confirmation-icon.danger {
      background: linear-gradient(135deg, #fecaca, #fee2e2);
      color: #dc2626;
      border: 2px solid #f87171;
      box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
    }

    .confirmation-icon.warning {
      background: linear-gradient(135deg, #fed7aa, #fef3c7);
      color: #d97706;
      border: 2px solid #fb923c;
      box-shadow: 0 2px 8px rgba(217, 119, 6, 0.2);
    }

    .confirmation-icon.info {
      background: linear-gradient(135deg, #bfdbfe, #dbeafe);
      color: #2563eb;
      border: 2px solid #60a5fa;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
    }

    .confirmation-icon.success {
      background: linear-gradient(135deg, #bbf7d0, #dcfce7);
      color: #16a34a;
      border: 2px solid #4ade80;
      box-shadow: 0 2px 8px rgba(22, 163, 74, 0.2);
    }

    .confirmation-message {
      flex: 1;
    }

    .main-message {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      color: #1f2937;
      line-height: 1.5;
    }

    .confirmation-details {
      margin-top: 1rem;
    }

    .confirmation-details ul {
      margin: 0;
      padding-left: 1.5rem;
      list-style-type: disc;
    }

    .confirmation-details li {
      margin-bottom: 0.5rem;
      color: #6b7280;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    /* Estilos responsivos */
    @media (max-width: 768px) {
      .confirmation-content {
        flex-direction: column;
        text-align: center;
      }

      .confirmation-icon {
        align-self: center;
      }
    }
  `]
})
export class ConfirmationModalComponent {
  @Input() visible: boolean = false;
  @Input() config: ConfirmationConfig = {
    title: 'Confirmar',
    message: 'Tem certeza que deseja continuar?'
  };
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get iconClass(): string {
    return `confirmation-icon ${this.config.severity || 'info'}`;
  }

  get titleWithIcon(): string {
    const severityIcons: Record<string, string> = {
      danger: '⚠️',
      warning: '⚡',
      info: 'ℹ️',
      success: '✅'
    };
    
    const icon = severityIcons[this.config.severity || 'info'] || 'ℹ️';
    return `${icon} ${this.config.title}`;
  }

  get modalStyleClass(): string {
    return `confirmation-modal confirmation-modal--${this.config.severity || 'info'}`;
  }

  get modalActions(): ModalAction[] {
    return [
      {
        label: this.config.cancelLabel || 'Cancelar',
        icon: 'pi pi-times',
        severity: 'secondary',
        outlined: true,
        action: () => this.onCancel()
      },
      {
        label: this.config.confirmLabel || 'Confirmar',
        icon: 'pi pi-check',
        severity: this.config.severity === 'danger' ? 'danger' : 'primary',
        action: () => this.onConfirm()
      }
    ];
  }

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onConfirm(): void {
    this.confirmed.emit();
    this.onHide();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.onHide();
  }
}