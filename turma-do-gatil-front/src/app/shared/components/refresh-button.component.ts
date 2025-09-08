import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-refresh-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="p-button p-button-sm" 
      [disabled]="loading"
      (click)="onRefresh()">
      <i class="pi" [ngClass]="loading ? 'pi-spinner pi-spin' : 'pi-refresh'"></i>
      {{ label }}
    </button>
  `,
  styles: [`
    .p-button {
      background: var(--p-primary-color, #F2BBAE);
      border: 1px solid var(--p-primary-color, #F2BBAE);
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .p-button:hover:not(:disabled) {
      background: var(--p-primary-600, #E5A898);
      border-color: var(--p-primary-600, #E5A898);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(242, 187, 174, 0.3);
    }

    .p-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .p-button-sm {
      padding: 0.5rem 0.875rem;
      font-size: 0.875rem;
    }

    .pi-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class RefreshButtonComponent {
  @Input() label: string = 'Atualizar';
  @Input() loading: boolean = false;
  @Output() refresh = new EventEmitter<void>();

  onRefresh() {
    if (!this.loading) {
      this.refresh.emit();
    }
  }
}
