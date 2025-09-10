import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { GenericModalComponent, ModalAction } from '../../../shared/components';
import { SterilizationDto, SterilizationRequest, CatSterilizationStatusDto } from '../../../models/sterilization.model';
import { SterilizationService } from '../../../services/sterilization.service';

@Component({
  selector: 'app-sterilization-schedule-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    MessageModule,
    DividerModule,
    GenericModalComponent
  ],
  template: `
    <app-generic-modal
      [(visible)]="visible"
      [title]="modalTitle"
      [actions]="modalActions"
      (hide)="onHide()"
      ngSkipHydration>
      
      <form [formGroup]="sterilizationForm" (ngSubmit)="onSubmit()" class="sterilization-schedule-form">

        <!-- Informações do Gato -->
        <div class="form-section">
          <h3>
            <i class="fas fa-cat"></i>
            Informações do Gato
          </h3>
          
          <div class="cat-info-display">
            <div class="cat-photo" *ngIf="cat?.photoUrl || sterilization?.photoUrl">
              <img [src]="cat?.photoUrl || sterilization?.photoUrl" 
                   [alt]="catName" 
                   (error)="$event.target.style.display='none'">
            </div>
            <div class="cat-details">
              <h4>{{ catName }}</h4>
              <div class="cat-meta" *ngIf="cat">
                <span class="cat-info-item">
                  <i class="pi pi-venus-mars"></i>
                  {{ getSexLabel(cat.sex) }}
                </span>
                <span class="cat-info-item">
                  <i class="pi pi-palette"></i>
                  {{ getColorLabel(cat.color) }}
                </span>
                <span class="cat-info-item">
                  <i class="pi pi-clock"></i>
                  {{ cat.ageInDays }} dias
                </span>
              </div>
            </div>
          </div>
        </div>

        <p-divider></p-divider>

        <!-- Agendamento -->
        <div class="form-section">
          <h3>
            <i class="fas fa-calendar-alt"></i>
            Dados do Agendamento
          </h3>
          
          <div class="form-grid">
            <!-- Data e Hora da Castração -->
            <div class="form-field form-field-full">
              <label for="sterilizationDate">Data e Hora da Castração *</label>
              <input 
                type="datetime-local" 
                id="sterilizationDate" 
                formControlName="sterilizationDate"
                [class.ng-invalid]="isFieldInvalid('sterilizationDate')"
                class="form-input datetime-input"
                [min]="minDate.toISOString().slice(0, 16)">
              <small class="error-message" *ngIf="getFieldError('sterilizationDate')">
                {{ getFieldError('sterilizationDate') }}
              </small>
              <small class="error-message" *ngIf="sterilizationForm.get('sterilizationDate')?.value && !isDateValid()">
                A data não pode ser no passado
              </small>
            </div>

            <!-- Observações -->
            <div class="form-field form-field-full">
              <label for="notes">Observações</label>
              <textarea 
                id="notes" 
                formControlName="notes"
                placeholder="Observações sobre o agendamento (opcional)"
                class="form-textarea"
                rows="3">
              </textarea>
              <small class="field-help">
                Informações adicionais sobre o agendamento, preparos necessários, etc.
              </small>
            </div>
          </div>
        </div>
      </form>
    </app-generic-modal>
  `,
  styleUrls: ['./sterilization-schedule-modal.component.css']
})
export class SterilizationScheduleModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() cat: CatSterilizationStatusDto | null = null; // Gato para agendar castração
  @Input() sterilization: SterilizationDto | null = null; // Castração para edição (null para criação)
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() sterilizationScheduled = new EventEmitter<void>();
  @Output() sterilizationUpdated = new EventEmitter<void>();

  sterilizationForm!: FormGroup;
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private sterilizationService: SterilizationService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sterilization'] && this.sterilizationForm) {
      this.updateFormForEditing();
    }
  }

  initForm(): void {
    // Data e hora padrão: amanhã às 09:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    
    this.sterilizationForm = this.fb.group({
      sterilizationDate: [tomorrow, Validators.required],
      notes: ['']
    });

    // Atualizar o formulário se estiver editando
    this.updateFormForEditing();
  }

  updateFormForEditing(): void {
    if (this.sterilization) {
      this.isEditMode = true;
      
      // Converter a data string para objeto Date
      const sterilizationDate = new Date(this.sterilization.sterilizationDate);
      
      this.sterilizationForm.patchValue({
        sterilizationDate: sterilizationDate,
        notes: this.sterilization.notes || ''
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
    this.sterilizationForm.reset();
    
    // Data e hora padrão: amanhã às 09:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    
    this.sterilizationForm.patchValue({
      sterilizationDate: tomorrow
    });
    
    this.loading = false;
    this.isEditMode = false;
  }

  onSubmit(): void {
    if (this.sterilizationForm.valid) {
      this.loading = true;
      
      const formValue = this.sterilizationForm.value;
      
      // Preparar dados da castração
      const sterilizationData: SterilizationRequest = {
        catId: this.isEditMode ? this.sterilization!.catId : this.cat!.id,
        sterilizationDate: formValue.sterilizationDate.toISOString(),
        status: this.isEditMode ? this.sterilization!.status : 'SCHEDULED', // Manter status original na edição ou 'SCHEDULED' para novo
        notes: formValue.notes || undefined
      };

      if (this.isEditMode && this.sterilization) {
        // Atualizar castração existente
        this.sterilizationService.updateSterilization(this.sterilization.id!, sterilizationData).subscribe({
          next: () => {
            this.sterilizationUpdated.emit();
            this.onHide();
          },
          error: (error) => {
            console.error('Erro ao atualizar agendamento:', error);
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });
      } else {
        // Criar novo agendamento
        this.sterilizationService.createSterilization(sterilizationData).subscribe({
          next: () => {
            this.sterilizationScheduled.emit();
            this.onHide();
          },
          error: (error) => {
            console.error('Erro ao agendar castração:', error);
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
    Object.keys(this.sterilizationForm.controls).forEach(key => {
      const control = this.sterilizationForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.sterilizationForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.sterilizationForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  get catName(): string {
    if (this.isEditMode && this.sterilization) {
      return this.sterilization.cat;
    }
    return this.cat?.name || 'Gato não identificado';
  }

  get modalTitle(): string {
    if (this.isEditMode) {
      return `Editar Agendamento - ${this.catName}`;
    }
    return `Agendar Castração - ${this.catName}`;
  }

  get modalActions(): ModalAction[] {
    // Garantir que o formulário esteja inicializado antes de verificar sua validade
    const isFormValid = this.sterilizationForm ? this.sterilizationForm.valid : false;
    const isDateValid = this.sterilizationForm ? this.isDateValid() : false;
    
    return [
      {
        label: 'Cancelar',
        icon: 'pi pi-times',
        severity: 'secondary',
        outlined: true,
        action: () => this.onHide()
      },
      {
        label: this.isEditMode ? 'Salvar Alterações' : 'Agendar Castração',
        icon: 'pi pi-check',
        loading: this.loading,
        disabled: !isFormValid || !isDateValid,
        action: () => this.onSubmit()
      }
    ];
  }

  // Validação de data - não permite datas no passado
  isDateValid(): boolean {
    if (!this.sterilizationForm) return false;
    
    const selectedDate = this.sterilizationForm.get('sterilizationDate')?.value;
    if (!selectedDate) return false;
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      
      return selected >= today;
    } catch (error) {
      return false;
    }
  }

  // Obter data mínima (hoje)
  get minDate(): Date {
    return new Date();
  }

  // Métodos de formatação (copiados do componente de castrações)
  getSexLabel(sex: string): string {
    switch (sex) {
      case 'MALE': return 'Macho';
      case 'FEMALE': return 'Fêmea';
      default: return sex;
    }
  }

  getColorLabel(color: string): string {
    switch (color) {
      case 'WHITE': return 'Branco';
      case 'BLACK': return 'Preto';
      case 'GRAY': return 'Cinza';
      case 'ORANGE': return 'Laranja';
      case 'BROWN': return 'Marrom';
      case 'MIXED': return 'Misto';
      case 'OTHER': return 'Outro';
      default: return color;
    }
  }
}
