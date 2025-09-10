import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Cat, Color, Sex, CatAdoptionStatus } from '../../../models/cat.model';
import { AdoptionModalComponent } from '../adoption-modal/adoption-modal.component';

@Component({
  selector: 'app-cat-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    DividerModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    AdoptionModalComponent
  ],
  templateUrl: './cat-details-modal.component.html',
  styleUrl: './cat-details-modal.component.css'
})
export class CatDetailsModalComponent {
  @Input() visible: boolean = false;
  @Input() cat: Cat | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() adoptCat = new EventEmitter<Cat>();
  @Output() editCat = new EventEmitter<Cat>();
  @Output() deleteCat = new EventEmitter<Cat>();

  showAdoptionModal = false;

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onAdoptCat(): void {
    this.showAdoptionModal = true;
  }

  onAdoptionCreated(): void {
    this.showAdoptionModal = false;
    this.adoptCat.emit(this.cat!);
  }

  onEditCat(): void {
    if (this.cat) {
      this.editCat.emit(this.cat);
    }
  }

  onDeleteCat(): void {
    if (this.cat) {
      this.deleteCat.emit(this.cat);
    }
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

  getSexLabel(sex: Sex): string {
    return sex === Sex.MALE ? 'Macho' : 'Fêmea';
  }

  getAge(birthDate: string): string {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    
    if (ageInMonths < 12) {
      return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getDaysInShelter(entryDate: string): number {
    const entry = new Date(entryDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - entry.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDefaultImage(): string {
    return 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  }

  onImageError(event: any): void {
    event.target.src = this.getDefaultImage();
  }

  getAdoptionStatusText(status: CatAdoptionStatus): string {
    switch(status) {
      case CatAdoptionStatus.NAO_ADOTADO:
        return 'Disponível para Adoção';
      case CatAdoptionStatus.EM_PROCESSO:
        return 'Em Processo de Adoção';
      case CatAdoptionStatus.ADOTADO:
        return 'Adotado';
      default:
        return 'Disponível para Adoção';
    }
  }

  getAdoptionStatusIcon(status: CatAdoptionStatus): string {
    switch(status) {
      case CatAdoptionStatus.NAO_ADOTADO:
        return 'fa-heart';
      case CatAdoptionStatus.EM_PROCESSO:
        return 'fa-clock';
      case CatAdoptionStatus.ADOTADO:
        return 'fa-home';
      default:
        return 'fa-heart';
    }
  }

  getAdoptionTagText(status: CatAdoptionStatus): string {
    switch(status) {
      case CatAdoptionStatus.NAO_ADOTADO:
        return 'Disponível';
      case CatAdoptionStatus.EM_PROCESSO:
        return 'Em Processo';
      case CatAdoptionStatus.ADOTADO:
        return 'Adotado';
      default:
        return 'Disponível';
    }
  }

  getAdoptionTagSeverity(status: CatAdoptionStatus): string {
    switch(status) {
      case CatAdoptionStatus.NAO_ADOTADO:
        return 'info';
      case CatAdoptionStatus.EM_PROCESSO:
        return 'warn';
      case CatAdoptionStatus.ADOTADO:
        return 'success';
      default:
        return 'info';
    }
  }
}
