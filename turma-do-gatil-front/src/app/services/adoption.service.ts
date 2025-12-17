import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Adoption, AdoptionRequest, AdoptionFilters, Page } from '../models/adoption.model';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {
  private readonly apiUrl = `${environment.apiUrl}/adoptions`;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  getAllAdoptions(filters: AdoptionFilters = {}): Observable<Page<Adoption>> {
    let params = new HttpParams();

    // Adiciona os filtros como parâmetros da query
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
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.catId) {
      params = params.set('catId', filters.catId);
    }
    if (filters.adopterId) {
      params = params.set('adopterId', filters.adopterId);
    }
    if (filters.catName) {
      params = params.set('catName', filters.catName);
    }
    if (filters.adopterName) {
      params = params.set('adopterName', filters.adopterName);
    }

    return this.http.get<Page<Adoption>>(this.apiUrl, { params }).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  getAdoptionById(id: string): Observable<Adoption> {
    return this.http.get<Adoption>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  createAdoption(adoption: AdoptionRequest): Observable<Adoption> {
    return this.http.post<Adoption>(this.apiUrl, adoption).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  updateAdoption(id: string, adoption: AdoptionRequest): Observable<Adoption> {
    console.log('Atualizando adoção ID:', id, 'com dados:', adoption);
    return this.http.put<Adoption>(`${this.apiUrl}/${id}`, adoption).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  deleteAdoption(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  getAdoptionsByCatId(catId: string): Observable<Adoption[]> {
    return this.http.get<Adoption[]>(`${this.apiUrl}/cat/${catId}`).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }
}
