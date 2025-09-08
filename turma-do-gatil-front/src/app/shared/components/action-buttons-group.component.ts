import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent, ActionButtonConfig } from './action-button.component';

@Component({
  selector: 'app-action-buttons-group',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent],
  template: `
    <div class="action-buttons">
      <app-action-button
        *ngFor="let buttonConfig of buttons"
        [config]="buttonConfig"
        [data]="data"
        (action)="onAction(buttonConfig.type, $event)">
      </app-action-button>
    </div>
  `,
  styles: [`
    .action-buttons {
      display: flex;
      gap: 0.25rem;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class ActionButtonsGroupComponent {
  @Input() buttons: ActionButtonConfig[] = [];
  @Input() data?: any;
  @Output() buttonClick = new EventEmitter<{type: string, data: any}>();

  onAction(type: string, data: any) {
    this.buttonClick.emit({ type, data });
  }
}
