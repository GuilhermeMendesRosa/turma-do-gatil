import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cat-info-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cat-info">
      <img 
        *ngIf="photoUrl; else catMiniPlaceholder" 
        [src]="photoUrl" 
        [alt]="name" 
        class="cat-mini-photo"
        (error)="$event.target.style.display='none'">
      <ng-template #catMiniPlaceholder>
        <div class="cat-mini-photo placeholder">
          <i class="pi pi-image"></i>
        </div>
      </ng-template>
      <div class="cat-details">
        <strong>{{ name || 'Nome não disponível' }}</strong>
      </div>
    </div>
  `,
  styles: [`
    .cat-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .cat-mini-photo {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      object-fit: cover;
      background: var(--p-surface-ground);
    }

    .cat-mini-photo.placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--p-text-color-secondary);
      font-size: 1rem;
    }

    .cat-details {
      display: flex;
      flex-direction: column;
    }

    .cat-details strong {
      color: var(--p-text-color);
      font-weight: 600;
    }
  `]
})
export class CatInfoCellComponent {
  @Input() photoUrl?: string;
  @Input() name?: string;
}
