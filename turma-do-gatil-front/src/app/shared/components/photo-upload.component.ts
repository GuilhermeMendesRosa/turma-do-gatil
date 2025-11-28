import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photo-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="photo-upload-container">
      @if (previewUrl) {
        <div class="photo-preview">
          <img [src]="previewUrl" [alt]="previewAlt" class="preview-image">
          <button 
            type="button" 
            class="remove-photo-btn" 
            (click)="onRemove()"
            [title]="removeButtonTitle">
            <i class="pi pi-trash"></i>
          </button>
        </div>
      } @else {
        <div class="upload-placeholder" (click)="triggerFileInput()">
          <i class="pi" [ngClass]="placeholderIcon"></i>
          <p>{{ placeholder }}</p>
          <input 
            type="file" 
            [accept]="accept"
            (change)="onFileChange($event)"
            class="file-input"
            #fileInput>
          <button 
            type="button" 
            class="upload-btn">
            {{ buttonLabel }}
          </button>
        </div>
      }
      
      @if (showFileInfo && file) {
        <small class="file-info">
          <i class="pi pi-file"></i>
          Arquivo selecionado: {{ file.name }} ({{ formatFileSize(file.size) }})
        </small>
      }
      
      @if (errorMessage) {
        <small class="error-message">
          <i class="pi pi-exclamation-circle"></i>
          {{ errorMessage }}
        </small>
      }
    </div>
  `,
  styles: [`
    .photo-upload-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .photo-preview {
      position: relative;
      display: inline-block;
      width: 150px;
      height: 150px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-photo-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.9);
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .remove-photo-btn:hover {
      background: #dc2626;
      transform: scale(1.1);
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      border: 2px dashed var(--p-surface-border);
      border-radius: 12px;
      background: var(--p-surface-ground);
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    }

    .upload-placeholder:hover {
      border-color: var(--p-primary-color);
      background: rgba(242, 187, 174, 0.1);
    }

    .upload-placeholder i {
      font-size: 2.5rem;
      color: var(--p-primary-color);
      margin-bottom: 0.75rem;
    }

    .upload-placeholder p {
      color: var(--p-text-color-secondary);
      margin: 0 0 1rem 0;
      font-size: 0.95rem;
    }

    .file-input {
      display: none;
    }

    .upload-btn {
      padding: 0.5rem 1.5rem;
      background: var(--p-primary-color);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .upload-btn:hover {
      background: var(--p-primary-color-emphasis);
      transform: translateY(-2px);
    }

    .file-info {
      color: var(--p-text-color-secondary);
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .file-info i {
      color: var(--p-primary-color);
    }

    .error-message {
      color: #ef4444;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  `]
})
export class PhotoUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  @Input() previewUrl: string | null = null;
  @Input() file: File | null = null;
  @Input() placeholder: string = 'Clique para adicionar uma foto';
  @Input() placeholderIcon: string = 'pi-camera';
  @Input() buttonLabel: string = 'Escolher Arquivo';
  @Input() removeButtonTitle: string = 'Remover foto';
  @Input() previewAlt: string = 'Preview';
  @Input() accept: string = 'image/*';
  @Input() showFileInfo: boolean = true;
  @Input() maxFileSize: number = 5 * 1024 * 1024; // 5MB default
  @Input() allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  @Output() previewUrlChange = new EventEmitter<string | null>();
  @Output() fileChange = new EventEmitter<File | null>();
  @Output() fileSelected = new EventEmitter<File>();
  @Output() fileRemoved = new EventEmitter<void>();
  @Output() error = new EventEmitter<string>();

  errorMessage: string | null = null;

  triggerFileInput(): void {
    this.fileInput?.nativeElement?.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) {
      return;
    }

    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      this.errorMessage = validation.error || 'Arquivo inválido';
      this.error.emit(this.errorMessage);
      input.value = '';
      return;
    }

    this.errorMessage = null;
    this.createPreview(file);
    this.file = file;
    this.fileChange.emit(file);
    this.fileSelected.emit(file);
  }

  onRemove(): void {
    this.previewUrl = null;
    this.file = null;
    this.previewUrlChange.emit(null);
    this.fileChange.emit(null);
    this.fileRemoved.emit();
    
    // Clear file input
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private validateFile(file: File): { valid: boolean; error?: string } {
    if (this.maxFileSize && file.size > this.maxFileSize) {
      return { 
        valid: false, 
        error: `O arquivo deve ter no máximo ${this.formatFileSize(this.maxFileSize)}`
      };
    }

    if (this.allowedTypes.length > 0 && !this.allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Tipo de arquivo não permitido. Use: JPG, PNG, GIF ou WebP'
      };
    }

    return { valid: true };
  }

  private createPreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.previewUrl = e.target?.result as string;
      this.previewUrlChange.emit(this.previewUrl);
    };
    reader.readAsDataURL(file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
