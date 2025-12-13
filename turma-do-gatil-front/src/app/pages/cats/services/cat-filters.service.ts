/**
 * Serviço para gerenciar estado e lógica dos filtros de gatos
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CatFilters, CatAdoptionStatus } from '../../../models/cat.model';
import { CATS_CONFIG } from '../constants/cats.constants';

@Injectable({
  providedIn: 'root'
})
export class CatFiltersService {

  private readonly _filters = new BehaviorSubject<CatFilters>(this.getDefaultFilters());
  
  /**
   * Observable dos filtros atuais
   */
  readonly filters$: Observable<CatFilters> = this._filters.asObservable();

  /**
   * Retorna os filtros padrão
   */
  private getDefaultFilters(): CatFilters {
    return {
      adoptionStatus: CATS_CONFIG.DEFAULT_ADOPTION_STATUS,
      color: null,
      sex: null,
      page: 0,
      size: CATS_CONFIG.DEFAULT_PAGE_SIZE,
      sortBy: CATS_CONFIG.DEFAULT_SORT_FIELD,
      sortDir: CATS_CONFIG.DEFAULT_SORT_DIRECTION
    };
  }

  /**
   * Retorna os filtros atuais
   */
  getCurrentFilters(): CatFilters {
    return this._filters.value;
  }

  /**
   * Atualiza os filtros
   */
  updateFilters(filters: Partial<CatFilters>): void {
    const currentFilters = this._filters.value;
    const updatedFilters = { ...currentFilters, ...filters };
    this._filters.next(updatedFilters);
  }

  /**
   * Limpa os filtros, mantendo apenas os padrão
   */
  clearFilters(): void {
    this._filters.next(this.getDefaultFilters());
  }

  /**
   * Reseta a página para 0 (útil quando aplicando novos filtros)
   */
  resetPage(): void {
    this.updateFilters({ page: 0 });
  }

  /**
   * Atualiza apenas o campo de ordenação
   */
  updateSort(sortBy: string, sortDir: 'asc' | 'desc' = 'asc'): void {
    this.updateFilters({ sortBy, sortDir, page: 0 });
  }

  /**
   * Atualiza o tamanho da página
   */
  updatePageSize(size: number): void {
    this.updateFilters({ size, page: 0 });
  }

  /**
   * Atualiza a página atual
   */
  updatePage(page: number): void {
    this.updateFilters({ page });
  }

  /**
   * Verifica se há filtros ativos (diferentes dos padrão)
   */
  hasActiveFilters(): boolean {
    const filters = this._filters.value;
    const defaultFilters = this.getDefaultFilters();
    
    return !!(
      filters.name ||
      filters.color ||
      filters.sex ||
      (filters.adoptionStatus !== defaultFilters.adoptionStatus && filters.adoptionStatus !== undefined)
    );
  }

  /**
   * Remove propriedades undefined/null dos filtros para API
   */
  getCleanFiltersForApi(): CatFilters {
    const filters = this._filters.value;
    const cleanFilters: CatFilters = {};

    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== null && value !== undefined && value !== '') {
        (cleanFilters as any)[key] = value;
      }
    });

    return cleanFilters;
  }

  /**
   * Processa o valor de ordenação do dropdown (pode incluir "-desc")
   */
  processSortValue(sortValue: string): { sortBy: string; sortDir: 'asc' | 'desc' } {
    if (sortValue?.includes('-desc')) {
      return {
        sortBy: sortValue.replace('-desc', ''),
        sortDir: 'desc'
      };
    }
    return {
      sortBy: sortValue,
      sortDir: 'asc'
    };
  }
}
