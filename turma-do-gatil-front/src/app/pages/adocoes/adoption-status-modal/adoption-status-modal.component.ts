import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Adoption, AdoptionStatus } from '../../../models/adoption.model';
import { AdoptionService } from '../../../services/adoption.service';

@Component({
  selector: 'app-adoption-status-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './adoption-status-modal.component.html',
  styleUrl: './adoption-status-modal.component.css'
})
export class AdoptionStatusModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() adoption: Adoption | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() adoptionUpdated = new EventEmitter<void>();

  statusForm!: FormGroup;
  loading = false;

  statusOptions = [
    { label: 'Pendente', value: AdoptionStatus.PENDING },
    { label: 'Concluída', value: AdoptionStatus.COMPLETED },
    { label: 'Cancelada', value: AdoptionStatus.CANCELED }
  ];

  constructor(
    private fb: FormBuilder,
    private adoptionService: AdoptionService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adoption'] && this.adoption) {
      this.populateForm();
    }
  }

  initForm(): void {
    this.statusForm = this.fb.group({
      status: ['', [Validators.required]]
    });
  }

  populateForm(): void {
    if (this.adoption) {
      this.statusForm.patchValue({
        status: this.adoption.status
      });
    }
  }

  onSubmit(): void {
    if (this.statusForm.valid && this.adoption) {
      this.loading = true;
      
      const adoptionRequest = {
        catId: this.adoption.catId,
        adopterId: this.adoption.adopterId,
        adoptionDate: this.adoption.adoptionDate,
        status: this.statusForm.value.status
      };

      this.adoptionService.updateAdoption(this.adoption.id, adoptionRequest).subscribe({
        next: () => {
          this.loading = false;
          this.adoptionUpdated.emit();
          this.onHide();
        },
        error: (error) => {
          console.error('Erro ao atualizar status da adoção:', error);
          this.loading = false;
        }
      });
    }
  }

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.statusForm.reset();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.statusForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.statusForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
    }
    return '';
  }
}
