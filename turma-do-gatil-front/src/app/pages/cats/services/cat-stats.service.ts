/**
 * Serviço para gerenciar estatísticas dos gatos
 */

import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Cat, CatAdoptionStatus } from '../../../models/cat.model';
import { StatsConfig } from '../models/cats-view.interface';
import { StatCardData } from '../../../shared/components';

@Injectable({
  providedIn: 'root'
})
export class CatStatsService {

  /**
   * Calcula as estatísticas baseado na lista de gatos e filtros atuais
   */
  calculateStats(
    cats: Cat[],
    totalRecords: number,
    currentAdoptionFilter?: CatAdoptionStatus
  ): StatsConfig {
    return {
      available: {
        count: this.getAvailableCatsCount(cats, totalRecords, currentAdoptionFilter),
        label: 'Disponíveis',
        description: 'Gatos prontos para adoção'
      },
      adopted: {
        count: this.getAdoptedCatsCount(cats, totalRecords, currentAdoptionFilter),
        label: 'Adotados',
        description: 'Gatos que encontraram um lar'
      },
      total: {
        count: totalRecords,
        label: 'Total',
        description: 'Total de gatos cadastrados'
      }
    };
  }

  /**
   * Converte as estatísticas para o formato esperado pelo StatsGridComponent
   */
  convertToStatCardData(stats: StatsConfig): StatCardData[] {
    return [
      {
        number: stats.available.count,
        label: stats.available.label,
        description: stats.available.description,
        icon: 'pi-heart',
        type: 'success'
      },
      {
        number: stats.adopted.count,
        label: stats.adopted.label,
        description: stats.adopted.description,
        icon: 'pi-home',
        type: 'warning'
      },
      {
        number: stats.total.count,
        label: stats.total.label,
        description: stats.total.description,
        icon: 'pi-tag',
        type: 'primary'
      }
    ];
  }

  /**
   * Calcula a quantidade de gatos disponíveis
   */
  private getAvailableCatsCount(
    cats: Cat[],
    totalRecords: number,
    currentAdoptionFilter?: CatAdoptionStatus
  ): number {
    // Se está filtrando especificamente por não adotados, retorna o total da consulta
    if (currentAdoptionFilter === CatAdoptionStatus.NAO_ADOTADO) {
      return totalRecords;
    }
    
    // Se está filtrando por em processo, retorna o total da consulta
    if (currentAdoptionFilter === CatAdoptionStatus.EM_PROCESSO) {
      return totalRecords;
    }
    
    // Caso contrário, conta os disponíveis na lista atual
    return cats.filter(cat => 
      cat.adoptionStatus === CatAdoptionStatus.NAO_ADOTADO || 
      cat.adoptionStatus === CatAdoptionStatus.EM_PROCESSO
    ).length;
  }

  /**
   * Calcula a quantidade de gatos adotados
   */
  private getAdoptedCatsCount(
    cats: Cat[],
    totalRecords: number,
    currentAdoptionFilter?: CatAdoptionStatus
  ): number {
    // Se está filtrando especificamente por adotados, retorna o total da consulta
    if (currentAdoptionFilter === CatAdoptionStatus.ADOTADO) {
      return totalRecords;
    }
    
    // Caso contrário, conta os adotados na lista atual
    return cats.filter(cat => cat.adoptionStatus === CatAdoptionStatus.ADOTADO).length;
  }

  /**
   * Cria um observable que transforma estatísticas em StatCardData
   */
  createStatsObservable(
    cats$: Observable<Cat[]>,
    totalRecords$: Observable<number>,
    adoptionFilter$: Observable<CatAdoptionStatus | undefined>
  ): Observable<StatCardData[]> {
    return cats$.pipe(
      map((cats) => {
        // Aqui você precisaria combinar com os outros observables
        // Para simplificar, retornamos uma implementação básica
        const stats = this.calculateStats(cats, cats.length);
        return this.convertToStatCardData(stats);
      })
    );
  }
}
