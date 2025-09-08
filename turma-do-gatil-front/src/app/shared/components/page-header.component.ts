import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">
        <i *ngIf="icon" class="pi" [ngClass]="icon"></i>
        {{ title }}
      </h1>
      <p *ngIf="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2.2rem;
      font-weight: 700;
      color: var(--p-text-color, #1f2937);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .page-title i {
      color: var(--p-primary-color, #F2BBAE);
      font-size: 2rem;
    }

    .page-subtitle {
      color: var(--p-text-color-secondary, #6b7280);
      margin: 0.5rem 0 0 0;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 1.8rem;
      }

      .page-title i {
        font-size: 1.6rem;
      }

      .page-subtitle {
        font-size: 1rem;
      }
    }
  `]
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
}
