import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  SterilizationStatsDto, 
  CatSterilizationStatusDto, 
  SterilizationDto, 
  SterilizationRequest, 
  SterilizationFilters, 
  Page,
  SterilizationDays 
} from '../models/sterilization.model';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SterilizationService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  // Obter estatísticas de castração
  getSterilizationStats(): Observable<SterilizationStatsDto> {
    return this.http.get<SterilizationStatsDto>(`${this.apiUrl}/cats/sterilization-stats`).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  // Obter gatos que precisam de castração
  getCatsNeedingSterilization(): Observable<CatSterilizationStatusDto[]> {
    return this.http.get<CatSterilizationStatusDto[]>(`${this.apiUrl}/cats/needing-sterilization`).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
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

    return this.http.get<Page<SterilizationDto>>(`${this.apiUrl}/sterilizations`, { params }).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
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

    return this.http.get<Page<SterilizationDto>>(`${this.apiUrl}/sterilizations/status/${status}`, { params }).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  // Obter castração por ID
  getSterilizationById(id: string): Observable<SterilizationDto> {
    return this.http.get<SterilizationDto>(`${this.apiUrl}/sterilizations/${id}`).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  // Criar nova castração
  createSterilization(sterilization: SterilizationRequest): Observable<SterilizationDto> {
    return this.http.post<SterilizationDto>(`${this.apiUrl}/sterilizations`, sterilization).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  // Atualizar castração
  updateSterilization(id: string, sterilization: SterilizationRequest): Observable<SterilizationDto> {
    return this.http.put<SterilizationDto>(`${this.apiUrl}/sterilizations/${id}`, sterilization).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  // Deletar castração
  deleteSterilization(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sterilizations/${id}`).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  // Obter castrações de um gato específico
  getSterilizationsByCatId(catId: string): Observable<SterilizationDto[]> {
    return this.http.get<SterilizationDto[]>(`${this.apiUrl}/sterilizations/cat/${catId}`).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  // Obter dias de castração
  getSterilizationDays(): Observable<SterilizationDays> {
    return this.http.get<SterilizationDays>(`${this.apiUrl}/sterilizations/days`).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  // Definir dias de castração
  setSterilizationDays(days: SterilizationDays): Observable<SterilizationDays> {
    return this.http.post<SterilizationDays>(`${this.apiUrl}/sterilizations/days`, days).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }
}
