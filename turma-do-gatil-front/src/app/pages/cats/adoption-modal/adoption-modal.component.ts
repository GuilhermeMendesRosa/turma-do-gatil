import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { Cat, Color } from '../../../models/cat.model';
import { Adopter } from '../../../models/adopter.model';
import { Adoption, AdoptionRequest, AdoptionStatus } from '../../../models/adoption.model';
import { AdopterService } from '../../../services/adopter.service';
import { AdoptionService } from '../../../services/adoption.service';
import { AdopterCreateModalComponent } from '../../adopters/adopter-create-modal/adopter-create-modal.component';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { GenericButtonComponent, GenericButtonConfig } from '../../../shared/components/generic-button.component';

@Component({
  selector: 'app-adoption-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    MessageModule,
    DividerModule,
    AdopterCreateModalComponent,
    GenericButtonComponent
  ],
  templateUrl: './adoption-modal.component.html',
  styleUrl: './adoption-modal.component.css'
})
export class AdoptionModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() visible: boolean = false;
  @Input() cat: Cat | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() adoptionCreated = new EventEmitter<void>();

  adoptionForm!: FormGroup;
  loading = false;
  searchLoading = false;
  noResultsFound = false;
  selectedAdopter: Adopter | null = null;
  filteredAdopters: Adopter[] = [];
  allAdopters: Adopter[] = [];
  showCreateAdopterModal = false;
  adopterSearchQuery = '';
  
  private searchSubject = new Subject<string>();
  private readonly minSearchLength = 2;

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
      label: 'Registrar Adoção',
      icon: 'pi-heart',
      loading: this.loading
    };
  }

  get createAdopterButtonConfig(): GenericButtonConfig {
    return {
      label: '',
      icon: 'pi-plus',
      severity: 'secondary',
      outlined: true
    };
  }

  constructor(
    private fb: FormBuilder,
    private adopterService: AdopterService,
    private adoptionService: AdoptionService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAdopters();
    this.initSearch();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible && this.adoptionForm) {
      this.resetForm();
    }
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.adoptionForm = this.fb.group({
      adopter: [null, Validators.required],
      adoptionDate: [today, Validators.required],
      status: [AdoptionStatus.PENDING, Validators.required]
    });
  }

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

  initSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300), // Aguarda 300ms após a última digitação
      distinctUntilChanged(), // Só faz a busca se o valor mudou
      switchMap((query: string) => {
        if (query.length < this.minSearchLength) {
          this.filteredAdopters = [];
          this.noResultsFound = false;
          return of([]);
        }

        this.searchLoading = true;
        this.noResultsFound = false;

        // Busca dinâmica com API
        return this.adopterService.getAllAdopters({ 
          size: 50,
          name: query // Busca por nome usando o filtro da API
        }).pipe(
          catchError((error) => {
            console.error('Erro na busca de adotantes:', error);
            // Fallback para busca local se API falhar
            return of({ content: this.searchLocal(query) });
          })
        );
      })
    ).subscribe({
      next: (response: any) => {
        this.searchLoading = false;
        const results = response.content || response;
        this.filteredAdopters = Array.isArray(results) ? results : [];
        this.noResultsFound = this.filteredAdopters.length === 0 && this.adopterSearchQuery.length >= this.minSearchLength;
      },
      error: (error) => {
        console.error('Erro na busca:', error);
        this.searchLoading = false;
        this.filteredAdopters = [];
        this.noResultsFound = true;
      }
    });
  }

  private searchLocal(query: string): Adopter[] {
    const lowerQuery = query.toLowerCase();
    return this.allAdopters.filter(adopter => {
      const fullName = `${adopter.firstName} ${adopter.lastName}`.toLowerCase();
      const email = adopter.email.toLowerCase();
      const cpf = adopter.cpf.replace(/\D/g, '');
      const queryNumbers = query.replace(/\D/g, '');
      
      return fullName.includes(lowerQuery) || 
             email.includes(lowerQuery) || 
             (queryNumbers.length > 0 && cpf.includes(queryNumbers));
    });
  }

  searchAdopters(event: any): void {
    this.onAdopterSearch(event);
  }

  onAdopterSearch(event: any): void {
    const query = event.target?.value || '';
    this.adopterSearchQuery = query;
    
    // Limpa a seleção atual quando digitar
    if (this.selectedAdopter && query !== `${this.selectedAdopter.firstName} ${this.selectedAdopter.lastName}`) {
      this.selectedAdopter = null;
      this.adoptionForm.patchValue({ adopter: null });
    }
    
    // Dispara a busca através do Subject (com debounce)
    this.searchSubject.next(query);
  }

  selectAdopter(adopter: Adopter): void {
    this.selectedAdopter = adopter;
    this.adopterSearchQuery = `${adopter.firstName} ${adopter.lastName}`;
    this.filteredAdopters = [];
    this.adoptionForm.patchValue({ adopter: adopter });
  }

  onInputFocus(): void {
    // Mostra os resultados novamente ao focar, se há texto
    if (this.adopterSearchQuery && this.adopterSearchQuery.length >= this.minSearchLength && !this.selectedAdopter) {
      this.searchSubject.next(this.adopterSearchQuery);
    }
  }

  onInputBlur(): void {
    // Oculta os resultados após um pequeno delay para permitir clique nas opções
    setTimeout(() => {
      this.filteredAdopters = [];
    }, 200);
  }

  clearSelection(): void {
    this.selectedAdopter = null;
    this.adopterSearchQuery = '';
    this.filteredAdopters = [];
    this.noResultsFound = false;
    this.searchLoading = false;
    this.adoptionForm.patchValue({ adopter: null });
  }

  onAdopterSelect(event: any): void {
    this.selectedAdopter = event;
  }

  getAdopterLabel(adopter: Adopter): string {
    return `${adopter.firstName} ${adopter.lastName} - ${adopter.email}`;
  }

  openCreateAdopterModal(): void {
    this.showCreateAdopterModal = true;
  }

  onAdopterCreated(): void {
    // Armazena a quantidade atual de adotantes
    const previousCount = this.allAdopters.length;
    
    this.adopterService.getAllAdopters({ size: 1000 }).subscribe({
      next: (response) => {
        this.allAdopters = response.content;
        
        // Se há um novo adotante, seleciona o mais recente
        if (this.allAdopters.length > previousCount) {
          // Ordena por data de registro decrescente e pega o primeiro (mais recente)
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

  formatCpf(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.resetForm();
  }

  resetForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.adoptionForm.patchValue({
      adopter: null,
      adoptionDate: today,
      status: AdoptionStatus.PENDING
    });
    this.selectedAdopter = null;
    this.adopterSearchQuery = '';
    this.filteredAdopters = [];
    this.noResultsFound = false;
    this.searchLoading = false;
    this.loading = false;
  }

  onSubmit(): void {
    if (this.adoptionForm.valid && this.cat && this.selectedAdopter) {
      this.loading = true;
      
      const formValue = this.adoptionForm.value;
      
      const adoptionData: AdoptionRequest = {
        catId: this.cat.id,
        adopterId: this.selectedAdopter.id,
        adoptionDate: new Date(formValue.adoptionDate).toISOString(),
        status: formValue.status
      };

      this.adoptionService.createAdoption(adoptionData).subscribe({
        next: () => {
          this.adoptionCreated.emit();
          this.onHide();
        },
        error: (error) => {
          console.error('Erro ao criar adoção:', error);
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
    Object.keys(this.adoptionForm.controls).forEach(key => {
      const control = this.adoptionForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.adoptionForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.adoptionForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  getColorLabel(color: Color): string {
    const colorMap: { [key in Color]: string } = {
      [Color.WHITE]: 'Branco',
      [Color.BLACK]: 'Preto',
      [Color.GRAY]: 'Cinza',
      [Color.BROWN]: 'Marrom',
      [Color.ORANGE]: 'Laranja',
      [Color.MIXED]: 'Misto',
      [Color.CALICO]: 'Cálico',
      [Color.TABBY]: 'Tigrado',
      [Color.SIAMESE]: 'Siamês',
      [Color.OTHER]: 'Outro'
    };
    return colorMap[color] || color;
  }
}
