import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Adopter, AdopterRequest, AdopterFilters, Page } from '../models/adopter.model';

@Injectable({
  providedIn: 'root'
})
export class AdopterService {
  private readonly apiUrl = 'http://localhost:8080/api/adopters';

  constructor(private http: HttpClient) { }

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

    return this.http.get<Page<Adopter>>(this.apiUrl, { params });
  }

  getAdopterById(id: string): Observable<Adopter> {
    return this.http.get<Adopter>(`${this.apiUrl}/${id}`);
  }

  createAdopter(adopter: AdopterRequest): Observable<Adopter> {
    return this.http.post<Adopter>(this.apiUrl, adopter);
  }

  updateAdopter(id: string, adopter: AdopterRequest): Observable<Adopter> {
    return this.http.put<Adopter>(`${this.apiUrl}/${id}`, adopter);
  }

  deleteAdopter(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
