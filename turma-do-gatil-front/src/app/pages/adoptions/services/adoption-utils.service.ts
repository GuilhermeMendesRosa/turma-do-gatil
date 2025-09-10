/**
 * Serviço utilitário para formatação e transformação de dados de adoção
 */

import { Injectable } from '@angular/core';
import { AdoptionStatus } from '../../../models/adoption.model';
import { Adopter } from '../../../models/adopter.model';
import { Cat } from '../../../models/cat.model';
import { STATUS_OPTIONS } from '../config/adoption.config';

@Injectable({
  providedIn: 'root'
})
export class AdoptionUtilsService {

  /**
   * Formata uma data para exibição em formato brasileiro
   * @param dateString - String da data a ser formatada
   * @returns Data formatada ou '-' se inválida
   */
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  }

  /**
   * Obtém o nome completo do adotante a partir do mapa de dados
   * @param adopterId - ID do adotante
   * @param adoptersMap - Mapa com dados dos adotantes
   * @returns Nome completo do adotante ou indicador de carregamento
   */
  getAdopterName(adopterId: string | undefined, adoptersMap: Record<string, Adopter>): string {
    if (!adopterId) return '-';
    
    const adopter = adoptersMap[adopterId];
    return adopter ? `${adopter.firstName} ${adopter.lastName}` : '...';
  }

  /**
   * Obtém o nome do gato a partir do mapa de dados
   * @param catId - ID do gato
   * @param catsMap - Mapa com dados dos gatos
   * @returns Nome do gato ou indicador de carregamento
   */
  getCatName(catId: string | undefined, catsMap: Record<string, Cat>): string {
    if (!catId) return '-';
    
    const cat = catsMap[catId];
    return cat ? cat.name : '...';
  }

  /**
   * Obtém o label de exibição para um status de adoção
   * @param status - Status da adoção
   * @returns Label formatado para exibição
   */
  getStatusLabel(status: AdoptionStatus): string {
    const statusOption = STATUS_OPTIONS.find(option => option.value === status);
    return statusOption?.label ?? status;
  }

  /**
   * Obtém a classe CSS para um status de adoção
   * @param status - Status da adoção
   * @returns Classe CSS correspondente ao status
   */
  getStatusClass(status: AdoptionStatus): string {
    switch (status) {
      case AdoptionStatus.COMPLETED:
        return 'completed';
      case AdoptionStatus.PENDING:
        return 'pending';
      case AdoptionStatus.CANCELED:
        return 'canceled';
      default:
        return '';
    }
  }

  /**
   * Obtém a severidade do badge para um status
   * @param status - Status da adoção
   * @returns Severidade para estilização do badge
   */
  getStatusSeverity(status: AdoptionStatus): 'success' | 'warning' | 'danger' | 'info' {
    const statusOption = STATUS_OPTIONS.find(option => option.value === status);
    return statusOption?.severity ?? 'info';
  }

  /**
   * Verifica se duas listas de IDs são equivalentes
   * @param list1 - Primeira lista de IDs
   * @param list2 - Segunda lista de IDs
   * @returns true se as listas contêm os mesmos IDs
   */
  areIdListsEqual(list1: string[], list2: string[]): boolean {
    if (list1.length !== list2.length) return false;
    
    const set1 = new Set(list1);
    const set2 = new Set(list2);
    
    return set1.size === set2.size && [...set1].every(id => set2.has(id));
  }

  /**
   * Extrai IDs únicos de uma propriedade de uma lista de objetos
   * @param items - Lista de objetos
   * @param propertyName - Nome da propriedade que contém o ID
   * @returns Array de IDs únicos
   */
  extractUniqueIds<T>(items: T[], propertyName: keyof T): string[] {
    const ids = items
      .map(item => item[propertyName] as unknown as string)
      .filter(Boolean);
    
    return Array.from(new Set(ids));
  }

  /**
   * Valida se um status é válido para transição
   * @param currentStatus - Status atual
   * @param newStatus - Novo status desejado
   * @returns true se a transição é válida
   */
  isValidStatusTransition(currentStatus: AdoptionStatus, newStatus: AdoptionStatus): boolean {
    // Todas as transições são permitidas por enquanto
    // Esta lógica pode ser refinada conforme regras de negócio
    return currentStatus !== newStatus;
  }
}
