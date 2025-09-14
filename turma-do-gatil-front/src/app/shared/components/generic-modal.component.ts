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
    /* ===== DIÁLOGO GENÉRICO ===== */
    :host ::ng-deep .generic-modal .p-dialog-mask,
    :host ::ng-deep .generic-modal-mask {
      background-color: rgba(0, 0, 0, 0.4) !important;
      backdrop-filter: blur(8px) !important;
      -webkit-backdrop-filter: blur(8px) !important;
    }

    :host ::ng-deep .generic-modal .p-dialog {
      background: #ffffff !important;
      border: 1px solid var(--p-surface-border, #e5e7eb);
      box-shadow: 0 16px 64px rgba(0, 0, 0, 0.2);
      border-radius: 12px;
    }

    :host ::ng-deep .generic-modal .p-dialog-header {
      background: linear-gradient(135deg, #F2BBAE, #E5A693) !important;
      color: white !important;
      border-radius: 12px 12px 0 0;
      padding: 1.5rem 2rem;
    }

    :host ::ng-deep .generic-modal .p-dialog-header .p-dialog-title {
      font-size: 1.4rem;
      font-weight: 600;
      color: white !important;
    }

    :host ::ng-deep .generic-modal .p-dialog-header .p-dialog-header-icon {
      color: white !important;
    }

    :host ::ng-deep .generic-modal .p-dialog-content {
      padding: 2rem;
      background: #ffffff !important;
    }

    :host ::ng-deep .generic-modal .p-dialog-footer {
      background: #ffffff !important;
      border-radius: 0 0 12px 12px;
      border-top: 1px solid var(--p-surface-border, #e5e7eb);
      padding: 0.75rem 2rem;
    }

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

    /* Fallback caso backdrop-filter não seja suportado */
    @supports not (backdrop-filter: blur(8px)) {
      :host ::ng-deep .generic-modal .p-dialog-mask,
      :host ::ng-deep .generic-modal-mask {
        background-color: rgba(0, 0, 0, 0.6) !important;
      }
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
