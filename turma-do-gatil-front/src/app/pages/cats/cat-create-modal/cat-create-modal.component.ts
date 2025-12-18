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
import { AutoCompleteModule } from 'primeng/autocomplete';

// RxJS
import { Observable, of } from 'rxjs';
import { switchMap, catchError, finalize } from 'rxjs/operators';

// Models
import { Cat, CatRequest, Color, Sex } from '../../../models/cat.model';
import { SterilizationRequest } from '../../../models/sterilization.model';
import { Adopter } from '../../../models/adopter.model';
import { AdoptionRequest, AdoptionStatus } from '../../../models/adoption.model';

// Services
import { CatService } from '../../../services/cat.service';
import { SterilizationService } from '../../../services/sterilization.service';
import { UploadService, UploadResponse } from '../../../services/upload.service';
import { NotificationService } from '../../../services/notification.service';
import { AdopterService } from '../../../services/adopter.service';
import { AdoptionService } from '../../../services/adoption.service';

// Shared Components
import { GenericButtonComponent, GenericButtonConfig } from '../../../shared/components/generic-button.component';
import { AdopterCreateModalComponent } from '../../adopters/adopter-create-modal/adopter-create-modal.component';

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
    AutoCompleteModule,
    GenericButtonComponent,
    AdopterCreateModalComponent
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

  // Adoption properties
  selectedAdopter: Adopter | null = null;
  allAdopters: Adopter[] = [];
  filteredAdopters: Adopter[] = [];
  showCreateAdopterModal = false;

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
    private notificationService: NotificationService,
    private adopterService: AdopterService,
    private adoptionService: AdoptionService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAdopters();
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
      sterilizationDate: [''], // Data da castração (se já foi castrado)
      alreadyAdopted: [false], // Campo para indicar se o gato já foi adotado
      adoptionDate: [todayString] // Data da adoção
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

  // ===== MÉTODOS DE ADOÇÃO =====

  loadAdopters(): void {
    this.adopterService.getAllAdopters({ size: 1000 }).subscribe({
      next: (response) => {
        this.allAdopters = response.content;
      },
      error: (error) => {
        console.error('Erro ao carregar adotantes:', error);
      }
    });
  }

  searchAdopters(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredAdopters = this.allAdopters.filter(adopter => {
      const fullName = `${adopter.firstName} ${adopter.lastName}`.toLowerCase();
      const email = adopter.email?.toLowerCase() || '';
      const cpf = adopter.cpf.replace(/\D/g, '');
      const queryNumbers = query.replace(/\D/g, '');
      
      return fullName.includes(query) || 
             email.includes(query) ||
             (queryNumbers.length > 0 && cpf.includes(queryNumbers));
    });
  }

  selectAdopter(event: any): void {
    this.selectedAdopter = event.value || event;
  }

  clearAdopterSelection(): void {
    this.selectedAdopter = null;
  }

  getAdopterLabel(adopter: Adopter): string {
    return `${adopter.firstName} ${adopter.lastName} - ${adopter.email || adopter.cpf}`;
  }

  formatCpf(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  openCreateAdopterModal(): void {
    this.showCreateAdopterModal = true;
  }

  onAdopterCreated(): void {
    const previousCount = this.allAdopters.length;
    
    this.adopterService.getAllAdopters({ size: 1000 }).subscribe({
      next: (response) => {
        this.allAdopters = response.content;
        
        if (this.allAdopters.length > previousCount) {
          const newestAdopter = this.allAdopters
            .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())[0];
          
          if (newestAdopter) {
            this.selectAdopter(newestAdopter);
          }
        }
      },
      error: (error) => {
        console.error('Erro ao carregar adotantes:', error);
      }
    });
    
    this.showCreateAdopterModal = false;
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
      shelterEntryDate: todayString,
      adoptionDate: todayString
    });
    this.selectedFile = null;
    this.previewUrl = null;
    this.loading = false;
    this.isEditMode = false;
    this.selectedAdopter = null;
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
  private handleImageUpload(): Observable<string | undefined> {
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

    // Se há preview (foto existente ou nova), usar ela
    if (this.previewUrl) {
      return of(this.previewUrl);
    }

    // Sem arquivo selecionado e sem preview - usar undefined para edição (remover foto) ou padrão para criação
    const photoUrl = this.isEditMode ? undefined : this.getDefaultImage();
    return of(photoUrl);
  }

  /**
   * Salva o gato (cria ou atualiza)
   * @returns Observable com o gato salvo
   */
  private saveCat(formValue: any, photoUrl: string | undefined): Observable<Cat> {
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
      // Sem castração, verificar se há adoção
      if (this.isEditMode) {
        this.catUpdated.emit();
        return of(void 0);
      } else {
        // Para criação, verificar se há adoção pendente
        this.handleAdoptionAfterCatCreated(cat.id, cat.photoUrl);
        return of(void 0);
      }
    }

    const sterilizationDate = formValue.sterilizationDate || formValue.shelterEntryDate;
    
    if (this.isEditMode) {
      this.handleSterilizationForExistingCat(cat.id, sterilizationDate);
    } else {
      this.createSterilizationForNewCat(cat.id, sterilizationDate, cat.photoUrl);
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
   * Nota: Para criação sem sterilização, o handleAdoptionAfterCatCreated já cuida do loading e onHide
   */
  private finalizeSubmit(formValue: any): void {
    // Para edição sem castração, podemos finalizar aqui
    if (this.isEditMode && !formValue.alreadySterilized) {
      this.loading = false;
      this.onHide();
    }
    // Para criação, o handleAdoptionAfterCatCreated cuida de tudo
  }

  private createSterilizationForNewCat(catId: string, sterilizationDate: string, photoUrl?: string): void {
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
        this.handleAdoptionAfterCatCreated(catId, photoUrl);
      },
      error: (error) => {
        console.error('Erro ao criar castração:', error);
        // Mesmo com erro na castração, tentar criar adoção se necessário
        this.handleAdoptionAfterCatCreated(catId, photoUrl);
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

  /**
   * Gerencia a criação de adoção após o gato ser criado
   */
  private handleAdoptionAfterCatCreated(catId: string, photoUrl?: string): void {
    const formValue = this.catForm.value;
    
    if (!formValue.alreadyAdopted || !this.selectedAdopter) {
      // Sem adoção, emitir evento e fechar
      this.catCreated.emit();
      this.loading = false;
      this.onHide();
      return;
    }

    const adoptionData: AdoptionRequest = {
      catId: catId,
      adopterId: this.selectedAdopter.id,
      adoptionDate: new Date(formValue.adoptionDate).toISOString(),
      status: AdoptionStatus.COMPLETED,
      adoptionTermPhoto: photoUrl // Usar a mesma foto do gato
    };

    this.adoptionService.createAdoption(adoptionData).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          'Sucesso',
          'Gato criado e adoção registrada com sucesso!'
        );
        this.catCreated.emit();
        this.loading = false;
        this.onHide();
      },
      error: (error) => {
        console.error('Erro ao criar adoção:', error);
        this.notificationService.showWarning(
          'Atenção',
          'Gato criado, mas houve um erro ao registrar a adoção. Por favor, registre a adoção manualmente.'
        );
        this.catCreated.emit();
        this.loading = false;
        this.onHide();
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
