import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading) {
      <div class="loading-container" [class.overlay]="overlay">
        <div class="loading-content">
          <i class="pi pi-spinner" [class.pi-spin]="spin"></i>
          @if (message) {
            <span class="loading-message">{{ message }}</span>
          }
        </div>
      </div>
    } @else {
      <ng-content></ng-content>
    }
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      min-height: 100px;
    }

    .loading-container.overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      z-index: 10;
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .loading-content i {
      font-size: 2rem;
      color: var(--p-primary-color);
    }

    .pi-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .loading-message {
      color: var(--p-text-color-secondary);
      font-size: 0.95rem;
    }
  `]
})
export class LoadingStateComponent {
  @Input() loading: boolean = false;
  @Input() message: string = 'Carregando...';
  @Input() overlay: boolean = false;
  @Input() spin: boolean = true;
}
