import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';

import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { Cat, CatRequest, Color, Sex, CatAdoptionStatus } from '../../../models/cat.model';
import { CatService } from '../../../services/cat.service';
import { SterilizationService } from '../../../services/sterilization.service';
import { SterilizationRequest } from '../../../models/sterilization.model';
import { GenericButtonComponent, GenericButtonConfig } from '../../../shared/components/generic-button.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cat-create-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    Select,
    MessageModule,
    DividerModule,
    CheckboxModule,
    GenericButtonComponent
  ],
  templateUrl: './cat-create-modal.component.html',
  styleUrl: './cat-create-modal.component.css'
})
export class CatCreateModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() cat: Cat | null = null; // Gato para edição (null para criação)
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() catCreated = new EventEmitter<void>();
  @Output() catUpdated = new EventEmitter<void>();

  catForm!: FormGroup;
  loading = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isEditMode = false;

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

  // Button configurations
  get cancelButtonConfig(): GenericButtonConfig {
    return {
      label: 'Cancelar',
      icon: 'pi-times',
      severity: 'secondary',
      outlined: true
    };
  }

  get saveButtonConfig(): GenericButtonConfig {
    return {
      label: this.isEditMode ? 'Salvar Alterações' : 'Salvar Gato',
      icon: 'pi-check',
      loading: this.loading,
      disabled: !this.catForm?.valid
    };
  }

  constructor(
    private fb: FormBuilder,
    private catService: CatService,
    private sterilizationService: SterilizationService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cat'] && this.catForm) {
      this.updateFormForEditing();
    }
  }

  initForm(): void {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    this.catForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      color: [null, Validators.required],
      sex: [null, Validators.required],
      birthDate: ['', Validators.required],
      shelterEntryDate: [todayString, Validators.required],
      alreadySterilized: [false], // Novo campo para indicar se o gato já é castrado
      sterilizationDate: [''] // Data da castração (se já foi castrado)
    });

    // Atualizar o formulário se estiver editando
    this.updateFormForEditing();
  }

  updateFormForEditing(): void {
    if (this.cat) {
      this.isEditMode = true;
      
      // Formatar datas para input type="date"
      const birthDate = new Date(this.cat.birthDate).toISOString().split('T')[0];
      const shelterEntryDate = new Date(this.cat.shelterEntryDate).toISOString().split('T')[0];
      
      this.catForm.patchValue({
        name: this.cat.name,
        color: this.cat.color,
        sex: this.cat.sex,
        birthDate: birthDate,
        shelterEntryDate: shelterEntryDate
      });

      // Definir preview da foto existente
      if (this.cat.photoUrl) {
        this.previewUrl = this.cat.photoUrl;
      }

      // Verificar se o gato já tem castração registrada
      this.checkExistingSterilization();
    } else {
      this.isEditMode = false;
    }
  }

  checkExistingSterilization(): void {
    if (this.cat?.id) {
      this.sterilizationService.getSterilizationsByCatId(this.cat.id).subscribe({
        next: (sterilizations) => {
          const completedSterilization = sterilizations.find(s => s.status === 'COMPLETED');
          if (completedSterilization) {
            const sterilizationDate = new Date(completedSterilization.sterilizationDate).toISOString().split('T')[0];
            this.catForm.patchValue({
              alreadySterilized: true,
              sterilizationDate: sterilizationDate
            });
          }
        },
        error: (error) => {
          console.error('Erro ao verificar castração:', error);
        }
      });
    }
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
    this.isEditMode = false;
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
        photoUrl: this.previewUrl || this.getDefaultImage(),
        adopted: this.isEditMode ? this.cat?.adopted : false,
        adoptionStatus: this.isEditMode ? this.cat?.adoptionStatus : undefined
      };

      if (this.isEditMode && this.cat) {
        // Atualizar gato existente
        this.catService.updateCat(this.cat.id, catData).subscribe({
          next: (updatedCat) => {
            // Se marcou como castrado, criar/atualizar castração
            if (formValue.alreadySterilized) {
              const sterilizationDate = formValue.sterilizationDate || formValue.shelterEntryDate;
              this.handleSterilizationForExistingCat(updatedCat.id, sterilizationDate);
            } else {
              this.catUpdated.emit();
              this.onHide();
              this.loading = false;
            }
          },
          error: (error) => {
            console.error('Erro ao atualizar gato:', error);
            this.loading = false;
          }
        });
      } else {
        // Criar novo gato
        this.catService.createCat(catData).subscribe({
          next: (newCat) => {
            // Se marcou como castrado, criar castração
            if (formValue.alreadySterilized) {
              const sterilizationDate = formValue.sterilizationDate || formValue.shelterEntryDate;
              this.createSterilizationForNewCat(newCat.id, sterilizationDate);
            } else {
              this.catCreated.emit();
              this.onHide();
              this.loading = false;
            }
          },
          error: (error) => {
            console.error('Erro ao criar gato:', error);
            this.loading = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createSterilizationForNewCat(catId: string, sterilizationDate: string): void {
    // Se não forneceu data de castração, usar a data de entrada no abrigo
    const finalDate = sterilizationDate || this.catForm.get('shelterEntryDate')?.value;
    
    const sterilizationData: SterilizationRequest = {
      catId: catId,
      sterilizationDate: new Date(finalDate).toISOString(),
      status: 'COMPLETED',
      notes: 'Castração registrada no cadastro do gato'
    };

    this.sterilizationService.createSterilization(sterilizationData).subscribe({
      next: () => {
        this.catCreated.emit();
        this.onHide();
      },
      error: (error) => {
        console.error('Erro ao criar castração:', error);
        // Mesmo com erro na castração, emitir evento de criação do gato
        this.catCreated.emit();
        this.onHide();
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private handleSterilizationForExistingCat(catId: string, sterilizationDate: string): void {
    // Verificar se já existe castração
    this.sterilizationService.getSterilizationsByCatId(catId).subscribe({
      next: (sterilizations) => {
        const completedSterilization = sterilizations.find(s => s.status === 'COMPLETED');
        
        if (completedSterilization) {
          // Atualizar castração existente
          const sterilizationData: SterilizationRequest = {
            catId: catId,
            sterilizationDate: new Date(sterilizationDate).toISOString(),
            status: 'COMPLETED',
            notes: completedSterilization.notes || 'Castração registrada no cadastro do gato'
          };

          this.sterilizationService.updateSterilization(completedSterilization.id!, sterilizationData).subscribe({
            next: () => {
              this.catUpdated.emit();
              this.onHide();
            },
            error: (error) => {
              console.error('Erro ao atualizar castração:', error);
              this.catUpdated.emit();
              this.onHide();
            },
            complete: () => {
              this.loading = false;
            }
          });
        } else {
          // Criar nova castração
          this.createSterilizationForNewCat(catId, sterilizationDate);
        }
      },
      error: (error) => {
        console.error('Erro ao verificar castrações:', error);
        this.catUpdated.emit();
        this.onHide();
        this.loading = false;
      }
    });
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
