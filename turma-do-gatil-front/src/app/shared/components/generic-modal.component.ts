import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ModalButtonComponent, ModalButtonConfig } from './modal-button.component';

export interface ModalAction {
  label: string;
  icon?: string;
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'help' | 'danger';
  outlined?: boolean;
  loading?: boolean;
  disabled?: boolean;
  action: () => void;
}

@Component({
  selector: 'app-generic-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ModalButtonComponent],
  template: `
    <p-dialog 
      [(visible)]="visible" 
      [modal]="true" 
      [closable]="closable"
      [draggable]="draggable"
      [resizable]="resizable"
      [styleClass]="styleClass"
      [maskStyleClass]="maskStyleClass"
      [style]="dialogStyle"
      [header]="title"
      (onHide)="onHide()"
      ngSkipHydration>
      
      <!-- Conteúdo do modal -->
      <div class="modal-content-wrapper">
        <ng-content></ng-content>
      </div>

      <!-- Footer com ações -->
      <ng-template pTemplate="footer">
        <div class="generic-modal-footer" *ngIf="actions && actions.length > 0">
          <app-modal-button 
            *ngFor="let action of actions"
            [config]="action"
          ></app-modal-button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    /* Estilos locais do generic modal - sem ::ng-deep */
    /* Os estilos do p-dialog estão definidos globalmente em primeng-overrides.css */
    
    .modal-content-wrapper {
      width: 100%;
    }

    .generic-modal-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 0.75rem;
      padding: 0;
      border: none;
      margin: 0;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0;
      border: none;
      margin: 0;
    }

    .action-buttons {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
  `]
})
export class GenericModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() title: string = '';
  @Input() closable: boolean = true;
  @Input() draggable: boolean = false;
  @Input() resizable: boolean = false;
  @Input() styleClass: string = 'generic-modal';
  @Input() maskStyleClass: string = 'generic-modal-mask';
  @Input() dialogStyle: any = { width: '90vw', maxWidth: '600px' };
  @Input() actions: ModalAction[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() hide = new EventEmitter<void>();

  ngOnInit() {
    // Modal initialized
  }

  ngOnChanges(changes: SimpleChanges) {
    // Handle changes if needed
  }

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.hide.emit();
  }
}
