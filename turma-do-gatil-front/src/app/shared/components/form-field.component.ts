import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-field tdg-form-field" [class.has-error]="showError">
      <label [attr.for]="fieldId">
        @if (icon) {
          <i class="pi" [ngClass]="icon"></i>
        }
        {{ label }}
        @if (required) {
          <span class="required">*</span>
        }
      </label>
      
      <div class="field-content">
        <ng-content></ng-content>
      </div>
      
      @if (showError && errorMessage) {
        <small class="error-message">
          <i class="pi pi-exclamation-circle"></i>
          {{ errorMessage }}
        </small>
      }
      
      @if (hint && !showError) {
        <small class="hint-message">{{ hint }}</small>
      }
    </div>
  `,
  styles: [`
    /* Estilos locais do form-field - sem ::ng-deep */
    /* Os estilos de inputs são definidos globalmente via classe .tdg-form-field em primeng-overrides.css */

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-weight: 600;
      color: var(--p-text-color);
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    label i {
      color: var(--p-primary-color);
      font-size: 0.85rem;
    }

    .required {
      color: #ef4444;
    }

    .field-content {
      width: 100%;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .error-message i {
      font-size: 0.75rem;
    }

    .hint-message {
      color: var(--p-text-color-secondary);
      font-size: 0.8rem;
    }
  `]
})
export class FormFieldComponent {
  @Input() label: string = '';
  @Input() icon?: string;
  @Input() fieldId?: string;
  @Input() required: boolean = false;
  @Input() control?: AbstractControl | null;
  @Input() errorMessage?: string;
  @Input() hint?: string;

  get showError(): boolean {
    if (!this.control) return false;
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }
}
