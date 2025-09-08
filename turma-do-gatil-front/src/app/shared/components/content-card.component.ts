import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-card">
      <div class="card-header">
        <h3>
          <i *ngIf="icon" class="pi" [ngClass]="icon"></i>
          {{ title }}
        </h3>
        <div class="actions" *ngIf="hasActions">
          <ng-content select="[slot=actions]"></ng-content>
        </div>
      </div>
      
      <div class="card-content">
        <ng-content></ng-content>
      </div>

      <div class="card-footer" *ngIf="hasFooter">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .content-card {
      background: var(--p-surface-card, #ffffff);
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid var(--p-surface-border, #e5e7eb);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--p-surface-border, #e5e7eb);
    }

    .card-header h3 {
      margin: 0;
      color: var(--p-text-color, #1f2937);
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .card-header h3 i {
      color: var(--p-primary-color, #F2BBAE);
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .card-content {
      width: 100%;
    }

    .card-footer {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--p-surface-border, #e5e7eb);
    }

    @media (max-width: 768px) {
      .content-card {
        padding: 1rem;
      }

      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .card-header h3 {
        font-size: 1.25rem;
      }
    }
  `]
})
export class ContentCardComponent {
  @Input() title: string = '';
  @Input() icon?: string;
  @Input() hasActions: boolean = false;
  @Input() hasFooter: boolean = false;
}
