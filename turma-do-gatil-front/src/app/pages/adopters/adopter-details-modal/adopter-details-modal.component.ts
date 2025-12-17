import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';

import { Adopter } from '../../../models/adopter.model';
import { Adoption, AdoptionStatus } from '../../../models/adoption.model';
import { Cat } from '../../../models/cat.model';
import { AdoptionService } from '../../../services/adoption.service';
import { CatService } from '../../../services/cat.service';
import { FormattingUtilsService } from '../../../shared/services/formatting-utils.service';

@Component({
  selector: 'app-adopter-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    TagModule
  ],
  templateUrl: './adopter-details-modal.component.html',
  styleUrl: './adopter-details-modal.component.css'
})
export class AdopterDetailsModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() adopter: Adopter | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();

  // Tab management
  activeTab: 'info' | 'cats' = 'info';

  // Adoptions/Cats properties
  adoptions: Adoption[] = [];
  loadingAdoptions = false;

  constructor(
    private adoptionService: AdoptionService,
    private catService: CatService,
    private formattingUtils: FormattingUtilsService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible && this.adopter) {
      this.loadAdoptions();
    }
  }

  /**
   * Carrega as adoções do adotante
   */
  loadAdoptions(): void {
    if (!this.adopter) return;

    this.loadingAdoptions = true;
    this.adoptionService.getAdoptionsByAdopterId(this.adopter.id).subscribe({
      next: (adoptions) => {
        this.adoptions = adoptions;
        this.loadCatsForAdoptions();
      },
      error: () => {
        this.loadingAdoptions = false;
      }
    });
  }

  /**
   * Carrega os dados dos gatos para cada adoção
   */
  private loadCatsForAdoptions(): void {
    if (this.adoptions.length === 0) {
      this.loadingAdoptions = false;
      return;
    }

    // Se as adoções já vêm com os dados do gato, não precisa carregar
    const adoptionsWithCat = this.adoptions.filter(a => a.cat);
    if (adoptionsWithCat.length === this.adoptions.length) {
      this.loadingAdoptions = false;
      return;
    }

    // Carregar dados dos gatos que não vieram na adoção
    let loadedCount = 0;
    const adoptionsWithoutCat = this.adoptions.filter(a => !a.cat);

    adoptionsWithoutCat.forEach(adoption => {
      this.catService.getCatById(adoption.catId).subscribe({
        next: (cat) => {
          adoption.cat = cat;
          loadedCount++;
          if (loadedCount === adoptionsWithoutCat.length) {
            this.loadingAdoptions = false;
          }
        },
        error: () => {
          loadedCount++;
          if (loadedCount === adoptionsWithoutCat.length) {
            this.loadingAdoptions = false;
          }
        }
      });
    });
  }

  /**
   * Fecha o modal
   */
  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.activeTab = 'info';
    this.adoptions = [];
  }

  /**
   * Retorna o nome completo do adotante
   */
  getFullName(): string {
    if (!this.adopter) return '';
    return this.formattingUtils.getFullName(this.adopter.firstName, this.adopter.lastName);
  }

  /**
   * Formata CPF
   */
  formatCpf(cpf: string): string {
    return this.formattingUtils.formatCpf(cpf);
  }

  /**
   * Formata telefone
   */
  formatPhone(phone: string): string {
    return this.formattingUtils.formatPhone(phone);
  }

  /**
   * Formata data
   */
  formatDate(date: string | undefined): string {
    return date ? this.formattingUtils.formatDate(date) : '-';
  }

  /**
   * Retorna a imagem padrão para gatos sem foto
   */
  getDefaultCatImage(): string {
    return 'assets/images/default-cat.png';
  }

  /**
   * Handler para erro de carregamento de imagem
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.getDefaultCatImage();
  }

  /**
   * Retorna o texto do status da adoção
   */
  getAdoptionStatusText(status: AdoptionStatus): string {
    const statusMap: Record<AdoptionStatus, string> = {
      [AdoptionStatus.PENDING]: 'Em Processo',
      [AdoptionStatus.COMPLETED]: 'Concluída',
      [AdoptionStatus.CANCELED]: 'Cancelada'
    };
    return statusMap[status] || status;
  }

  /**
   * Retorna a classe CSS para o status da adoção
   */
  getAdoptionStatusClass(status: AdoptionStatus): string {
    const classMap: Record<AdoptionStatus, string> = {
      [AdoptionStatus.PENDING]: 'status-pending',
      [AdoptionStatus.COMPLETED]: 'status-completed',
      [AdoptionStatus.CANCELED]: 'status-canceled'
    };
    return classMap[status] || '';
  }

  /**
   * Retorna a severidade do tag para o status
   */
  getAdoptionStatusSeverity(status: AdoptionStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const severityMap: Record<AdoptionStatus, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      [AdoptionStatus.PENDING]: 'warn',
      [AdoptionStatus.COMPLETED]: 'success',
      [AdoptionStatus.CANCELED]: 'danger'
    };
    return severityMap[status] || 'info';
  }

  /**
   * Retorna o ícone do status da adoção
   */
  getAdoptionStatusIcon(status: AdoptionStatus): string {
    const iconMap: Record<AdoptionStatus, string> = {
      [AdoptionStatus.PENDING]: 'pi pi-clock',
      [AdoptionStatus.COMPLETED]: 'pi pi-check-circle',
      [AdoptionStatus.CANCELED]: 'pi pi-times-circle'
    };
    return iconMap[status] || 'pi pi-info-circle';
  }
}
