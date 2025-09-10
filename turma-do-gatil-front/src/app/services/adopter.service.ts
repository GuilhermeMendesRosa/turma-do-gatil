import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Adopter, AdopterRequest, AdopterFilters, Page } from '../models/adopter.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AdopterService {
  private readonly apiUrl = 'https://turma-do-gatil-production.up.railway.app/api/adopters';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  getAllAdopters(filters: AdopterFilters = {}): Observable<Page<Adopter>> {
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
    if (filters.name) {
      params = params.set('name', filters.name);
    }

    return this.http.get<Page<Adopter>>(this.apiUrl, { params }).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  getAdopterById(id: string): Observable<Adopter> {
    return this.http.get<Adopter>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  createAdopter(adopter: AdopterRequest): Observable<Adopter> {
    return this.http.post<Adopter>(this.apiUrl, adopter).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  updateAdopter(id: string, adopter: AdopterRequest): Observable<Adopter> {
    return this.http.put<Adopter>(`${this.apiUrl}/${id}`, adopter).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  deleteAdopter(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }
}
