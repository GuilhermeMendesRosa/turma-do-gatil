import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-field" [class.has-error]="showError">
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

    .field-content ::ng-deep input,
    .field-content ::ng-deep select,
    .field-content ::ng-deep textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--p-surface-border);
      border-radius: 8px;
      background: white;
      color: var(--p-text-color);
      transition: all 0.3s ease;
      font-size: 0.95rem;
      box-sizing: border-box;
    }

    .field-content ::ng-deep input:focus,
    .field-content ::ng-deep select:focus,
    .field-content ::ng-deep textarea:focus {
      border-color: var(--p-primary-color);
      box-shadow: 0 0 0 3px rgba(242, 187, 174, 0.2);
      outline: none;
    }

    .field-content ::ng-deep input::placeholder,
    .field-content ::ng-deep textarea::placeholder {
      color: var(--p-text-color-secondary);
    }

    .has-error .field-content ::ng-deep input,
    .has-error .field-content ::ng-deep select,
    .has-error .field-content ::ng-deep textarea {
      border-color: #ef4444;
    }

    .has-error .field-content ::ng-deep input:focus,
    .has-error .field-content ::ng-deep select:focus,
    .has-error .field-content ::ng-deep textarea:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
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
