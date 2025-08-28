import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { CatRequest, Color, Sex } from '../../../models/cat.model';
import { CatService } from '../../../services/cat.service';

@Component({
  selector: 'app-cat-create-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    Select,
    MessageModule,
    DividerModule
  ],
  templateUrl: './cat-create-modal.component.html',
  styleUrl: './cat-create-modal.component.css'
})
export class CatCreateModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() catCreated = new EventEmitter<void>();

  catForm!: FormGroup;
  loading = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  colorOptions = [
    { label: 'Branco', value: Color.WHITE },
    { label: 'Preto', value: Color.BLACK },
    { label: 'Cinza', value: Color.GRAY },
    { label: 'Marrom', value: Color.BROWN },
    { label: 'Laranja', value: Color.ORANGE },
    { label: 'Misto', value: Color.MIXED },
    { label: 'Cálico', value: Color.CALICO },
    { label: 'Tigrado', value: Color.TABBY },
    { label: 'Siamês', value: Color.SIAMESE },
    { label: 'Outro', value: Color.OTHER }
  ];

  sexOptions = [
    { label: 'Macho', value: Sex.MALE },
    { label: 'Fêmea', value: Sex.FEMALE }
  ];

  constructor(
    private fb: FormBuilder,
    private catService: CatService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    this.catForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      color: [null, Validators.required],
      sex: [null, Validators.required],
      birthDate: ['', Validators.required],
      shelterEntryDate: [todayString, Validators.required]
    });
  }

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.resetForm();
  }

  resetForm(): void {
    this.catForm.reset();
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    this.catForm.patchValue({
      shelterEntryDate: todayString
    });
    this.selectedFile = null;
    this.previewUrl = null;
    this.loading = false;
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileRemove(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  onSubmit(): void {
    if (this.catForm.valid) {
      this.loading = true;
      
      const formValue = this.catForm.value;
      
      // Converter datas para string ISO
      const catData: CatRequest = {
        name: formValue.name,
        color: formValue.color,
        sex: formValue.sex,
        birthDate: new Date(formValue.birthDate).toISOString(),
        shelterEntryDate: new Date(formValue.shelterEntryDate).toISOString(),
        photoUrl: this.previewUrl || 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        adopted: false // Sempre false para novos gatos
      };

      this.catService.createCat(catData).subscribe({
        next: () => {
          this.catCreated.emit();
          this.onHide();
        },
        error: (error) => {
          console.error('Erro ao criar gato:', error);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.catForm.controls).forEach(key => {
      const control = this.catForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.catForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['minlength']) {
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.catForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  getDefaultImage(): string {
    return 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  }
}
