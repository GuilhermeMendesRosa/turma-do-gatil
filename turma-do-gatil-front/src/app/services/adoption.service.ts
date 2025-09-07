import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Adoption, AdoptionRequest, AdoptionFilters, Page } from '../models/adoption.model';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {
  private readonly apiUrl = 'https://turma-do-gatil-production.up.railway.app/api/cats/api/adoptions';

  constructor(private http: HttpClient) { }

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

    return this.http.get<Page<Adoption>>(this.apiUrl, { params });
  }

  getAdoptionById(id: string): Observable<Adoption> {
    return this.http.get<Adoption>(`${this.apiUrl}/${id}`);
  }

  createAdoption(adoption: AdoptionRequest): Observable<Adoption> {
    return this.http.post<Adoption>(this.apiUrl, adoption);
  }

  updateAdoption(id: string, adoption: AdoptionRequest): Observable<Adoption> {
    return this.http.put<Adoption>(`${this.apiUrl}/${id}`, adoption);
  }

  deleteAdoption(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
