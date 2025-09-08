import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-truncated-text-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [title]="text">
      {{ text || '-' | slice:0:maxLength }}
      <span *ngIf="text && text.length > maxLength">...</span>
    </span>
  `,
  styles: [`
    span {
      color: var(--p-text-color);
    }
  `]
})
export class TruncatedTextCellComponent {
  @Input() text?: string;
  @Input() maxLength: number = 50;
}
