import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  SterilizationStatsDto, 
  CatSterilizationStatusDto, 
  SterilizationDto, 
  SterilizationRequest, 
  SterilizationFilters, 
  Page 
} from '../models/sterilization.model';

@Injectable({
  providedIn: 'root'
})
export class SterilizationService {
  private readonly apiUrl = 'https://turma-do-gatil-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  // Obter estatísticas de castração
  getSterilizationStats(): Observable<SterilizationStatsDto> {
    return this.http.get<SterilizationStatsDto>(`${this.apiUrl}/cats/sterilization-stats`);
  }

  // Obter gatos que precisam de castração
  getCatsNeedingSterilization(): Observable<CatSterilizationStatusDto[]> {
    return this.http.get<CatSterilizationStatusDto[]>(`${this.apiUrl}/cats/needing-sterilization`);
  }

  // Obter todas as castrações com filtros
  getAllSterilizations(filters: SterilizationFilters = {}): Observable<Page<SterilizationDto>> {
    let params = new HttpParams();

    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.size !== undefined) {
      params = params.set('size', filters.size.toString());
    }
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters.sortDir) {
      params = params.set('sortDir', filters.sortDir);
    }
    if (filters.catId) {
      params = params.set('catId', filters.catId);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate);
    }

    return this.http.get<Page<SterilizationDto>>(`${this.apiUrl}/sterilizations`, { params });
  }

  // Obter castrações por status
  getSterilizationsByStatus(status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED', filters: SterilizationFilters = {}): Observable<Page<SterilizationDto>> {
    let params = new HttpParams();

    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.size !== undefined) {
      params = params.set('size', filters.size.toString());
    }
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters.sortDir) {
      params = params.set('sortDir', filters.sortDir);
    }

    return this.http.get<Page<SterilizationDto>>(`${this.apiUrl}/sterilizations/status/${status}`, { params });
  }

  // Obter castração por ID
  getSterilizationById(id: string): Observable<SterilizationDto> {
    return this.http.get<SterilizationDto>(`${this.apiUrl}/sterilizations/${id}`);
  }

  // Criar nova castração
  createSterilization(sterilization: SterilizationRequest): Observable<SterilizationDto> {
    return this.http.post<SterilizationDto>(`${this.apiUrl}/sterilizations`, sterilization);
  }

  // Atualizar castração
  updateSterilization(id: string, sterilization: SterilizationRequest): Observable<SterilizationDto> {
    return this.http.put<SterilizationDto>(`${this.apiUrl}/sterilizations/${id}`, sterilization);
  }

  // Deletar castração
  deleteSterilization(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sterilizations/${id}`);
  }

  // Obter castrações de um gato específico
  getSterilizationsByCatId(catId: string): Observable<SterilizationDto[]> {
    return this.http.get<SterilizationDto[]>(`${this.apiUrl}/sterilizations/cat/${catId}`);
  }
}
