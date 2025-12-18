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
import { CepService } from '../../../services/cep.service';
import { GenericButtonComponent, GenericButtonConfig } from '../../../shared/components/generic-button.component';

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
    DividerModule,
    GenericButtonComponent
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
  searchingCep = false;
  isEditMode = false;

  cancelButtonConfig: GenericButtonConfig = {
    label: 'Cancelar',
    icon: 'pi pi-times',
    severity: 'secondary',
    outlined: true
  };

  saveButtonConfig: GenericButtonConfig = {
    label: 'Salvar Adotante',
    icon: 'pi pi-check',
    severity: 'primary',
    loading: false,
    disabled: false
  };

  get dynamicSaveButtonConfig(): GenericButtonConfig {
    return {
      ...this.saveButtonConfig,
      loading: this.loading,
      disabled: !this.adopterForm.valid
    };
  }

  constructor(
    private fb: FormBuilder,
    private adopterService: AdopterService,
    private cepService: CepService
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
      birthDate: [''],
      cpf: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.email]],
      instagram: [''],
      // Address fields
      street: ['', [Validators.required]],
      number: ['', [Validators.required]],
      neighborhood: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required, Validators.maxLength(2)]],
      zipCode: ['', [Validators.required]],
      complement: [''],
      registrationDate: [todayString, Validators.required]
    });

    // Atualizar o formulário se estiver editando
    this.updateFormForEditing();
  }

  updateFormForEditing(): void {
    if (this.adopter) {
      this.isEditMode = true;
      this.saveButtonConfig.label = 'Salvar Alterações';
      
      // Formatar datas para input type="date"
      const birthDate = this.adopter.birthDate ? new Date(this.adopter.birthDate).toISOString().split('T')[0] : '';
      const registrationDate = new Date(this.adopter.registrationDate).toISOString().split('T')[0];
      
      this.adopterForm.patchValue({
        firstName: this.adopter.firstName,
        lastName: this.adopter.lastName,
        birthDate: birthDate,
        cpf: this.adopter.cpf,
        phone: this.adopter.phone,
        email: this.adopter.email || '',
        instagram: this.adopter.instagram || '',
        // Address fields
        street: this.adopter.address?.street || '',
        number: this.adopter.address?.number || '',
        neighborhood: this.adopter.address?.neighborhood || '',
        city: this.adopter.address?.city || '',
        state: this.adopter.address?.state || '',
        zipCode: this.adopter.address?.zipCode || '',
        complement: this.adopter.address?.complement || '',
        registrationDate: registrationDate
      });
    } else {
      this.isEditMode = false;
      this.saveButtonConfig.label = 'Salvar Adotante';
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
      
      // Limpar formatação do CPF e telefone antes de enviar
      const cleanCpf = formValue.cpf.replace(/\D/g, ''); // Remove tudo que não é dígito
      const cleanPhone = formValue.phone.replace(/\D/g, ''); // Remove tudo que não é dígito
      const cleanZipCode = formValue.zipCode.replace(/\D/g, ''); // Remove tudo que não é dígito
      
      // Converter datas para string ISO
      const adopterData: AdopterRequest = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        birthDate: formValue.birthDate ? new Date(formValue.birthDate).toISOString() : undefined,
        cpf: cleanCpf,
        phone: cleanPhone,
        email: formValue.email || undefined,
        instagram: formValue.instagram || undefined,
        address: {
          street: formValue.street,
          number: formValue.number,
          neighborhood: formValue.neighborhood,
          city: formValue.city,
          state: formValue.state.toUpperCase(),
          zipCode: cleanZipCode,
          complement: formValue.complement || undefined
        },
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

  onCepBlur(): void {
    const cep = this.adopterForm.get('zipCode')?.value;
    if (cep && cep.replace(/\D/g, '').length === 8) {
      this.searchingCep = true;
      this.cepService.searchCep(cep).subscribe({
        next: (address) => {
          if (address) {
            this.adopterForm.patchValue({
              street: address.street,
              neighborhood: address.neighborhood,
              city: address.city,
              state: address.state
            });
          }
          this.searchingCep = false;
        },
        error: () => {
          this.searchingCep = false;
        }
      });
    }
  }
}
