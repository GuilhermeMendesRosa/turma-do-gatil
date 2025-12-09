// Angular Core
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';

// RxJS
import { Observable, of } from 'rxjs';
import { switchMap, catchError, finalize } from 'rxjs/operators';

// Models
import { Cat, CatRequest, Color, Sex } from '../../../models/cat.model';
import { SterilizationRequest } from '../../../models/sterilization.model';

// Services
import { CatService } from '../../../services/cat.service';
import { SterilizationService } from '../../../services/sterilization.service';
import { UploadService, UploadResponse } from '../../../services/upload.service';
import { NotificationService } from '../../../services/notification.service';

// Shared Components
import { GenericButtonComponent, GenericButtonConfig } from '../../../shared/components/generic-button.component';

@Component({
  selector: 'app-cat-create-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
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
      disabled: !this.catForm?.valid || this.loading
    };
  }

  constructor(
    private fb: FormBuilder,
    private catService: CatService,
    private sterilizationService: SterilizationService,
    private uploadService: UploadService,
    private notificationService: NotificationService
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
      birthDate: [''],
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
      const birthDate = this.cat.birthDate ? new Date(this.cat.birthDate).toISOString().split('T')[0] : '';
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
    this.loading = false; // Garantir que loading seja resetado
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

  /**
   * Manipula a seleção de arquivo de imagem
   * Valida o arquivo e cria um preview se for válido
   */
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const validation = this.uploadService.validateImageFile(file);
    if (!validation.valid) {
      this.notificationService.showError(
        'Arquivo Inválido',
        validation.error || 'O arquivo selecionado não é válido.'
      );
      // Limpar o input file
      event.target.value = '';
      return;
    }

    this.selectedFile = file;
    this.createImagePreview(file);
  }

  /**
   * Cria um preview da imagem selecionada
   */
  private createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  onFileRemove(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    // Se estiver editando, restaurar a foto original do gato
    if (this.isEditMode && this.cat?.photoUrl) {
      this.previewUrl = this.cat.photoUrl;
    }
  }

  /**
   * Submete o formulário para criar ou editar um gato
   * Gerencia upload de imagem, criação/edição do gato e registro de castração
   */
  onSubmit(): void {
    if (!this.catForm.valid || this.loading) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formValue = this.catForm.value;

    this.handleImageUpload()
      .pipe(
        switchMap(photoUrl => this.saveCat(formValue, photoUrl)),
        switchMap(cat => this.handleSterilization(cat, formValue)),
        catchError(error => this.handleSubmitError(error)),
        finalize(() => this.finalizeSubmit(formValue))
      )
      .subscribe();
  }

  /**
   * Gerencia o upload da imagem se houver arquivo selecionado
   * @returns Observable com a URL da foto
   */
  private handleImageUpload(): Observable<string> {
    if (this.selectedFile) {
      return this.uploadService.uploadImage(this.selectedFile).pipe(
        switchMap(response => {
          const photoUrl = response.fileUrl || this.getDefaultImage();
          return of(photoUrl);
        }),
        catchError(error => {
          this.notificationService.showError(
            'Erro no Upload',
            'Não foi possível fazer upload da imagem. Usando imagem padrão.'
          );
          return of(this.getDefaultImage());
        })
      );
    }

    // Se não tem arquivo selecionado, usar foto existente ou padrão
    const existingPhotoUrl = this.isEditMode && this.cat?.photoUrl 
      ? this.cat.photoUrl 
      : this.getDefaultImage();
    return of(existingPhotoUrl);
  }

  /**
   * Salva o gato (cria ou atualiza)
   * @returns Observable com o gato salvo
   */
  private saveCat(formValue: any, photoUrl: string): Observable<Cat> {
    const catData: CatRequest = {
      name: formValue.name,
      color: formValue.color,
      sex: formValue.sex,
      birthDate: formValue.birthDate ? new Date(formValue.birthDate).toISOString() : undefined,
      shelterEntryDate: new Date(formValue.shelterEntryDate).toISOString(),
      photoUrl: photoUrl,
      adopted: this.isEditMode ? this.cat?.adopted : false,
      adoptionStatus: this.isEditMode ? this.cat?.adoptionStatus : undefined
    };

    if (this.isEditMode && this.cat) {
      return this.catService.updateCat(this.cat.id, catData);
    }
    
    return this.catService.createCat(catData);
  }

  /**
   * Gerencia a castração do gato se necessário
   * @returns Observable que completa após o processamento
   */
  private handleSterilization(cat: Cat, formValue: any): Observable<void> {
    if (!formValue.alreadySterilized) {
      // Emitir evento apropriado e retornar
      if (this.isEditMode) {
        this.catUpdated.emit();
      } else {
        this.catCreated.emit();
      }
      return of(void 0);
    }

    const sterilizationDate = formValue.sterilizationDate || formValue.shelterEntryDate;
    
    if (this.isEditMode) {
      this.handleSterilizationForExistingCat(cat.id, sterilizationDate);
    } else {
      this.createSterilizationForNewCat(cat.id, sterilizationDate);
    }

    // Retornar observable vazio já que a castração é tratada separadamente
    return of(void 0);
  }

  /**
   * Trata erros durante o submit
   */
  private handleSubmitError(error: any): Observable<never> {
    console.error('Erro ao processar gato:', error);
    this.notificationService.showError(
      'Erro ao Salvar',
      `Não foi possível ${this.isEditMode ? 'atualizar' : 'criar'} o gato. Tente novamente.`
    );
    throw error;
  }

  /**
   * Finaliza o processo de submit
   */
  private finalizeSubmit(formValue: any): void {
    if (!formValue.alreadySterilized) {
      this.loading = false;
      this.onHide();
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
