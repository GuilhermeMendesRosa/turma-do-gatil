/**
 * Serviço utilitário para formatação e transformação de dados de gatos
 */

import { Injectable } from '@angular/core';
import { Cat, CatAdoptionStatus, Color, Sex } from '../../../models/cat.model';
import { CatDisplayInfo } from '../models/cats-view.interface';
import { COLOR_LABELS, SEX_LABELS, ADOPTION_STATUS_CONFIG, DEFAULT_IMAGES } from '../constants/cats.constants';

@Injectable({
  providedIn: 'root'
})
export class CatDisplayService {

  /**
   * Converte um objeto Cat em CatDisplayInfo para apresentação na UI
   */
  transformCatToDisplayInfo(cat: Cat): CatDisplayInfo {
    return {
      id: cat.id,
      name: cat.name,
      age: this.calculateAge(cat.birthDate),
      colorLabel: this.getColorLabel(cat.color),
      sexLabel: this.getSexLabel(cat.sex),
      entryDateFormatted: this.formatDate(cat.shelterEntryDate),
      adoptionStatus: this.getAdoptionStatusInfo(cat.adoptionStatus),
      imageUrl: cat.photoUrl || DEFAULT_IMAGES.CAT_PLACEHOLDER
    };
  }

  /**
   * Calcula a idade de um gato baseado na data de nascimento
   */
  calculateAge(birthDate: string): string {
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

  /**
   * Formata uma data para o padrão brasileiro
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Retorna o label em português para uma cor
   */
  getColorLabel(color: Color): string {
    return COLOR_LABELS[color] || color;
  }

  /**
   * Retorna o label em português para um sexo
   */
  getSexLabel(sex: Sex): string {
    return SEX_LABELS[sex];
  }

  /**
   * Retorna as informações de display para um status de adoção
   */
  getAdoptionStatusInfo(status: CatAdoptionStatus) {
    return ADOPTION_STATUS_CONFIG[status] || ADOPTION_STATUS_CONFIG[CatAdoptionStatus.NAO_ADOTADO];
  }

  /**
   * Retorna a URL da imagem padrão
   */
  getDefaultImageUrl(): string {
    return DEFAULT_IMAGES.CAT_PLACEHOLDER;
  }

  /**
   * Verifica se uma string de data é válida
   */
  isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  /**
   * Converte uma lista de gatos para informações de display
   */
  transformCatsToDisplayInfo(cats: Cat[]): CatDisplayInfo[] {
    return cats.map(cat => this.transformCatToDisplayInfo(cat));
  }
}
