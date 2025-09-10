import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'help' | 'danger';

export interface ModalButtonConfig {
  label: string;
  icon?: string;
  severity?: ModalButtonSeverity;
  outlined?: boolean;
  loading?: boolean;
  disabled?: boolean;
  action: () => void;
}

@Component({
  selector: 'app-modal-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      type="button"
      class="modal-button"
      [ngClass]="getButtonClasses()"
      [disabled]="config.disabled || config.loading"
      (click)="onClick()">
      
      <i *ngIf="config.loading" class="pi pi-spinner pi-spin loading-icon"></i>
      <i *ngIf="config.icon && !config.loading" class="pi" [ngClass]="config.icon"></i>
      
      <span class="button-label">{{ config.label }}</span>
    </button>
  `,
  styles: [`
    .modal-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: 1px solid;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 2.5rem;
      white-space: nowrap;
      text-decoration: none;
      line-height: 1;
    }

    .modal-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-icon {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Primary Button */
    .btn-primary {
      background: linear-gradient(135deg, #F2BBAE, #E5A693) !important;
      border-color: #F2BBAE !important;
      color: white !important;
    }

    .btn-primary:hover:not(:disabled) {
      background: #E5A693 !important;
      border-color: #E5A693 !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(242, 187, 174, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6 !important;
      cursor: not-allowed !important;
      background: #cccccc !important;
      border-color: #cccccc !important;
      color: #666666 !important;
    }

    .btn-primary.outlined {
      background: transparent;
      color: var(--p-primary-color, #F2BBAE);
    }

    .btn-primary.outlined:hover:not(:disabled) {
      background: var(--p-primary-color, #F2BBAE);
      color: white;
    }

    /* Secondary Button */
    .btn-secondary {
      background: var(--p-surface-100, #f3f4f6);
      border-color: var(--p-surface-border, #e5e7eb);
      color: var(--p-text-color, #374151);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--p-surface-200, #e5e7eb);
      border-color: var(--p-surface-300, #d1d5db);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .btn-secondary.outlined {
      background: transparent;
      color: var(--p-text-color-secondary, #6b7280);
    }

    .btn-secondary.outlined:hover:not(:disabled) {
      background: var(--p-surface-100, #f3f4f6);
      color: var(--p-text-color, #374151);
    }

    /* Success Button */
    .btn-success {
      background: #22c55e;
      border-color: #22c55e;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #16a34a;
      border-color: #16a34a;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    }

    .btn-success.outlined {
      background: transparent;
      color: #22c55e;
    }

    .btn-success.outlined:hover:not(:disabled) {
      background: #22c55e;
      color: white;
    }

    /* Info Button */
    .btn-info {
      background: #3b82f6;
      border-color: #3b82f6;
      color: white;
    }

    .btn-info:hover:not(:disabled) {
      background: #2563eb;
      border-color: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .btn-info.outlined {
      background: transparent;
      color: #3b82f6;
    }

    .btn-info.outlined:hover:not(:disabled) {
      background: #3b82f6;
      color: white;
    }

    /* Help Button */
    .btn-help {
      background: #8b5cf6;
      border-color: #8b5cf6;
      color: white;
    }

    .btn-help:hover:not(:disabled) {
      background: #7c3aed;
      border-color: #7c3aed;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }

    .btn-help.outlined {
      background: transparent;
      color: #8b5cf6;
    }

    .btn-help.outlined:hover:not(:disabled) {
      background: #8b5cf6;
      color: white;
    }

    /* Danger Button */
    .btn-danger {
      background: #ef4444;
      border-color: #ef4444;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #dc2626;
      border-color: #dc2626;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    .btn-danger.outlined {
      background: transparent;
      color: #ef4444;
    }

    .btn-danger.outlined:hover:not(:disabled) {
      background: #ef4444;
      color: white;
    }
  `]
})
export class ModalButtonComponent {
  @Input() config!: ModalButtonConfig;
  @Output() click = new EventEmitter<void>();

  getButtonClasses(): string {
    const classes = [`btn-${this.config.severity || 'primary'}`];
    
    if (this.config.outlined) {
      classes.push('outlined');
    }

    return classes.join(' ');
  }

  onClick(): void {
    if (!this.config.disabled && !this.config.loading) {
      this.config.action();
      this.click.emit();
    }
  }
}
