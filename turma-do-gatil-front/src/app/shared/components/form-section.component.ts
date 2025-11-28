import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-section">
      <h3 class="section-title">
        @if (icon) {
          <i class="pi" [ngClass]="icon"></i>
        }
        {{ title }}
      </h3>
      
      @if (description) {
        <p class="section-description">{{ description }}</p>
      }
      
      <div class="form-grid" [style.--columns]="columns">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .form-section {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--p-surface-border);
    }

    .form-section:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--p-text-color);
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-title i {
      color: var(--p-primary-color);
      font-size: 1rem;
    }

    .section-description {
      color: var(--p-text-color-secondary);
      font-size: 0.9rem;
      margin: -0.5rem 0 1rem 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(var(--columns, 2), 1fr);
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FormSectionComponent {
  @Input() title: string = '';
  @Input() icon?: string;
  @Input() description?: string;
  @Input() columns: number = 2;
}
