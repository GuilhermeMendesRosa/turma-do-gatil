import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatCardData {
  number: number;
  label: string;
  description: string;
  icon: string;
  type: 'eligible' | 'overdue' | 'success' | 'warning' | 'info' | 'primary';
}

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [ngClass]="data.type">
      <div class="stat-icon">
        <i class="pi" [ngClass]="data.icon"></i>
      </div>
      <div class="stat-content">
        <div class="stat-number">{{ data.number || 0 }}</div>
        <div class="stat-label">{{ data.label }}</div>
        <div class="stat-description">{{ data.description }}</div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: var(--p-surface-card, #ffffff);
      border-radius: 12px;
      border: 1px solid var(--p-surface-border, #e5e7eb);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 2px 8px rgba(242, 187, 174, 0.15);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(242, 187, 174, 0.25);
    }

    .stat-card.eligible {
      border-left: 4px solid #22c55e;
    }

    .stat-card.overdue {
      border-left: 4px solid #ef4444;
    }

    .stat-card.success {
      border-left: 4px solid #10b981;
    }

    .stat-card.warning {
      border-left: 4px solid #f59e0b;
    }

    .stat-card.info {
      border-left: 4px solid #3b82f6;
    }

    .stat-card.primary {
      border-left: 4px solid var(--p-primary-color, #F2BBAE);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
      flex-shrink: 0;
    }

    .stat-card.eligible .stat-icon {
      background: linear-gradient(135deg, #22c55e, #16a34a);
    }

    .stat-card.overdue .stat-icon {
      background: linear-gradient(135deg, #ef4444, #dc2626);
    }

    .stat-card.success .stat-icon {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .stat-card.warning .stat-icon {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    .stat-card.info .stat-icon {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
    }

    .stat-card.primary .stat-icon {
      background: linear-gradient(135deg, var(--p-primary-color, #F2BBAE), var(--p-primary-600, #E5A898));
    }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: var(--p-text-color, #1f2937);
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-weight: 600;
      color: var(--p-text-color, #1f2937);
      margin-bottom: 0.25rem;
    }

    .stat-description {
      font-size: 0.875rem;
      color: var(--p-text-color-secondary, #6b7280);
    }

    @media (max-width: 480px) {
      .stat-card {
        padding: 1rem;
      }

      .stat-icon {
        width: 50px;
        height: 50px;
      }

      .stat-number {
        font-size: 1.5rem;
      }
    }
  `]
})
export class StatCardComponent {
  @Input() data!: StatCardData;
}
