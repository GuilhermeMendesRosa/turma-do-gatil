import { Injectable } from '@angular/core';

// Types for the labels
export type Color = 'WHITE' | 'BLACK' | 'GRAY' | 'BROWN' | 'ORANGE' | 'MIXED' | 'CALICO' | 'TABBY' | 'SIAMESE' | 'OTHER';
export type Sex = 'MALE' | 'FEMALE';
export type AdoptionStatus = 'PENDING' | 'COMPLETED' | 'CANCELED';
export type CatAdoptionStatus = 'NAO_ADOTADO' | 'EM_PROCESSO' | 'ADOTADO';
export type SterilizationStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELED' | 'ELIGIBLE' | 'OVERDUE';

export interface LabelConfig {
  label: string;
  severity?: 'success' | 'info' | 'warn' | 'danger' | 'secondary';
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabelMapperService {
  
  // ==================== COLOR MAPPINGS ====================
  private readonly colorLabels: Record<Color, string> = {
    WHITE: 'Branco',
    BLACK: 'Preto',
    GRAY: 'Cinza',
    BROWN: 'Marrom',
    ORANGE: 'Laranja',
    MIXED: 'Misto',
    CALICO: 'Cálico',
    TABBY: 'Tigrado',
    SIAMESE: 'Siamês',
    OTHER: 'Outro'
  };

  getColorLabel(color: Color | string): string {
    return this.colorLabels[color as Color] || color;
  }

  getColorOptions(): { label: string; value: Color }[] {
    return Object.entries(this.colorLabels).map(([value, label]) => ({
      label,
      value: value as Color
    }));
  }

  // ==================== SEX MAPPINGS ====================
  private readonly sexLabels: Record<Sex, string> = {
    MALE: 'Macho',
    FEMALE: 'Fêmea'
  };

  getSexLabel(sex: Sex | string): string {
    return this.sexLabels[sex as Sex] || sex;
  }

  getSexOptions(): { label: string; value: Sex }[] {
    return Object.entries(this.sexLabels).map(([value, label]) => ({
      label,
      value: value as Sex
    }));
  }

  // ==================== ADOPTION STATUS MAPPINGS ====================
  private readonly adoptionStatusConfig: Record<AdoptionStatus, LabelConfig> = {
    PENDING: { label: 'Pendente', severity: 'warn', icon: 'pi-clock' },
    COMPLETED: { label: 'Concluída', severity: 'success', icon: 'pi-check' },
    CANCELED: { label: 'Cancelada', severity: 'danger', icon: 'pi-times' }
  };

  getAdoptionStatusLabel(status: AdoptionStatus | string): string {
    return this.adoptionStatusConfig[status as AdoptionStatus]?.label || status;
  }

  getAdoptionStatusConfig(status: AdoptionStatus | string): LabelConfig {
    return this.adoptionStatusConfig[status as AdoptionStatus] || { label: status };
  }

  getAdoptionStatusOptions(): { label: string; value: AdoptionStatus }[] {
    return Object.entries(this.adoptionStatusConfig).map(([value, config]) => ({
      label: config.label,
      value: value as AdoptionStatus
    }));
  }

  // ==================== CAT ADOPTION STATUS MAPPINGS ====================
  private readonly catAdoptionStatusConfig: Record<CatAdoptionStatus, LabelConfig> = {
    NAO_ADOTADO: { label: 'Disponível', severity: 'success', icon: 'pi-heart' },
    EM_PROCESSO: { label: 'Em Processo', severity: 'warn', icon: 'pi-clock' },
    ADOTADO: { label: 'Adotado', severity: 'info', icon: 'pi-check' }
  };

  getCatAdoptionStatusLabel(status: CatAdoptionStatus | string): string {
    return this.catAdoptionStatusConfig[status as CatAdoptionStatus]?.label || status;
  }

  getCatAdoptionStatusConfig(status: CatAdoptionStatus | string): LabelConfig {
    return this.catAdoptionStatusConfig[status as CatAdoptionStatus] || { label: status };
  }

  getCatAdoptionStatusOptions(): { label: string; value: CatAdoptionStatus }[] {
    return Object.entries(this.catAdoptionStatusConfig).map(([value, config]) => ({
      label: config.label,
      value: value as CatAdoptionStatus
    }));
  }

  // ==================== STERILIZATION STATUS MAPPINGS ====================
  private readonly sterilizationStatusConfig: Record<SterilizationStatus, LabelConfig> = {
    SCHEDULED: { label: 'Agendada', severity: 'info', icon: 'pi-calendar' },
    COMPLETED: { label: 'Realizada', severity: 'success', icon: 'pi-check-circle' },
    CANCELED: { label: 'Cancelada', severity: 'danger', icon: 'pi-times-circle' },
    ELIGIBLE: { label: 'Elegível', severity: 'success', icon: 'pi-check' },
    OVERDUE: { label: 'Atrasada', severity: 'danger', icon: 'pi-exclamation-triangle' }
  };

  getSterilizationStatusLabel(status: SterilizationStatus | string): string {
    return this.sterilizationStatusConfig[status as SterilizationStatus]?.label || status;
  }

  getSterilizationStatusConfig(status: SterilizationStatus | string): LabelConfig {
    return this.sterilizationStatusConfig[status as SterilizationStatus] || { label: status };
  }

  getSterilizationStatusOptions(): { label: string; value: SterilizationStatus }[] {
    return Object.entries(this.sterilizationStatusConfig)
      .filter(([value]) => ['SCHEDULED', 'COMPLETED', 'CANCELED'].includes(value))
      .map(([value, config]) => ({
        label: config.label,
        value: value as SterilizationStatus
      }));
  }

  // ==================== UTILITY METHODS ====================
  
  /**
   * Generic method to get a label for any status/enum
   */
  getLabel(type: 'color' | 'sex' | 'adoptionStatus' | 'catAdoptionStatus' | 'sterilizationStatus', value: string): string {
    switch (type) {
      case 'color':
        return this.getColorLabel(value);
      case 'sex':
        return this.getSexLabel(value);
      case 'adoptionStatus':
        return this.getAdoptionStatusLabel(value);
      case 'catAdoptionStatus':
        return this.getCatAdoptionStatusLabel(value);
      case 'sterilizationStatus':
        return this.getSterilizationStatusLabel(value);
      default:
        return value;
    }
  }
}
