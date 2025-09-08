import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent, StatCardData } from './stat-card.component';

@Component({
  selector: 'app-stats-grid',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  template: `
    <div class="stats-grid">
      <app-stat-card 
        *ngFor="let stat of stats" 
        [data]="stat">
      </app-stat-card>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StatsGridComponent {
  @Input() stats: StatCardData[] = [];
}
