import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { Adopter, AdopterRequest } from '../../../models/adopter.model';
import { AdopterService } from '../../../services/adopter.service';

@Component({
  selector: 'app-adopter-create-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    MessageModule,
    DividerModule
  ],
  templateUrl: './adopter-create-modal.component.html',
  styleUrl: './adopter-create-modal.component.css'
})
export class AdopterCreateModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() adopter: Adopter | null = null; // Adotante para edição (null para criação)
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() adopterCreated = new EventEmitter<void>();
  @Output() adopterUpdated = new EventEmitter<void>();

  adopterForm!: FormGroup;
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private adopterService: AdopterService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adopter'] && this.adopterForm) {
      this.updateFormForEditing();
    }
  }

  initForm(): void {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    this.adopterForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', Validators.required],
      cpf: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      registrationDate: [todayString, Validators.required]
    });

    // Atualizar o formulário se estiver editando
    this.updateFormForEditing();
  }

  updateFormForEditing(): void {
    if (this.adopter) {
      this.isEditMode = true;
      
      // Formatar datas para input type="date"
      const birthDate = new Date(this.adopter.birthDate).toISOString().split('T')[0];
      const registrationDate = new Date(this.adopter.registrationDate).toISOString().split('T')[0];
      
      this.adopterForm.patchValue({
        firstName: this.adopter.firstName,
        lastName: this.adopter.lastName,
        birthDate: birthDate,
        cpf: this.adopter.cpf,
        phone: this.adopter.phone,
        email: this.adopter.email,
        address: this.adopter.address,
        registrationDate: registrationDate
      });
    } else {
      this.isEditMode = false;
    }
  }

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.resetForm();
  }

  resetForm(): void {
    this.adopterForm.reset();
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    this.adopterForm.patchValue({
      registrationDate: todayString
    });
    this.loading = false;
    this.isEditMode = false;
  }

  onSubmit(): void {
    if (this.adopterForm.valid) {
      this.loading = true;
      
      const formValue = this.adopterForm.value;
      
      // Converter datas para string ISO
      const adopterData: AdopterRequest = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        birthDate: new Date(formValue.birthDate).toISOString(),
        cpf: formValue.cpf,
        phone: formValue.phone,
        email: formValue.email,
        address: formValue.address,
        registrationDate: new Date(formValue.registrationDate).toISOString()
      };

      if (this.isEditMode && this.adopter) {
        // Atualizar adotante existente
        this.adopterService.updateAdopter(this.adopter.id, adopterData).subscribe({
          next: () => {
            this.adopterUpdated.emit();
            this.onHide();
          },
          error: (error) => {
            console.error('Erro ao atualizar adotante:', error);
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });
      } else {
        // Criar novo adotante
        this.adopterService.createAdopter(adopterData).subscribe({
          next: () => {
            this.adopterCreated.emit();
            this.onHide();
          },
          error: (error) => {
            console.error('Erro ao criar adotante:', error);
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.adopterForm.controls).forEach(key => {
      const control = this.adopterForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.adopterForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['minlength']) {
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.adopterForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
