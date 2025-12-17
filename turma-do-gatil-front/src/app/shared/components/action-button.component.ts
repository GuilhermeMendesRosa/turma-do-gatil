import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ActionButtonType = 'schedule' | 'edit' | 'complete' | 'cancel' | 'info' | 'view';

export interface ActionButtonConfig {
  type: ActionButtonType;
  tooltip: string;
  disabled?: boolean;
  visible?: boolean;
}

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      *ngIf="config.visible !== false"
      class="p-button-icon"
      [ngClass]="getButtonClass()"
      [title]="config.tooltip"
      [disabled]="config.disabled"
      (click)="onClick()">
      <i class="pi" [ngClass]="getIconClass()"></i>
    </button>
  `,
  styles: [`
    .p-button-icon {
      padding: 0.5rem;
      border-radius: 50%;
      min-width: 2.5rem;
      height: 2.5rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
      background: var(--p-surface-card, #ffffff);
      border: 1px solid var(--p-surface-border, #e5e7eb);
      margin: 0 2px;
    }

    .p-button-icon:hover:not(:disabled) {
      background: var(--p-surface-hover, #f3f4f6);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .p-button-icon:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .p-button-info { 
      background: #17a2b8; 
      color: white; 
      border-color: #17a2b8;
    }
    .p-button-info:hover:not(:disabled) { 
      background: #138496; 
      border-color: #138496;
      box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
    }

    .p-button-warning { 
      background: #ffc107; 
      color: #212529; 
      border-color: #ffc107;
    }
    .p-button-warning:hover:not(:disabled) { 
      background: #e0a800; 
      border-color: #e0a800;
      box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
    }

    .p-button-success { 
      background: #28a745; 
      color: white; 
      border-color: #28a745;
    }
    .p-button-success:hover:not(:disabled) { 
      background: #218838; 
      border-color: #218838;
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
    }

    .p-button-danger { 
      background: #dc3545; 
      color: white; 
      border-color: #dc3545;
    }
    .p-button-danger:hover:not(:disabled) { 
      background: #c82333; 
      border-color: #c82333;
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    }
  `]
})
export class ActionButtonComponent {
  @Input() config!: ActionButtonConfig;
  @Input() data?: any;
  @Output() action = new EventEmitter<any>();

  private buttonClassMap = {
    schedule: 'p-button-info',
    edit: 'p-button-warning',
    complete: 'p-button-success',
    cancel: 'p-button-danger',
    info: 'p-button-info',
    view: 'p-button-info'
  };

  private iconClassMap = {
    schedule: 'pi-calendar-plus',
    edit: 'pi-pencil',
    complete: 'pi-check',
    cancel: 'pi-trash',
    info: 'pi-info-circle',
    view: 'pi-eye'
  };

  getButtonClass(): string {
    return this.buttonClassMap[this.config.type] || 'p-button-info';
  }

  getIconClass(): string {
    return this.iconClassMap[this.config.type] || 'pi-info-circle';
  }

  onClick() {
    if (!this.config.disabled) {
      this.action.emit(this.data);
    }
  }
}
