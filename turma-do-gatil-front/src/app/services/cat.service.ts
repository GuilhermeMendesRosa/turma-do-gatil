import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cat, CatRequest, CatFilters, Page } from '../models/cat.model';
import { DashboardSummary } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class CatService {
  private readonly apiUrl = 'https://turma-do-gatil-production.up.railway.app/api/cats/api/cats';

  constructor(private http: HttpClient) { }

  getAllCats(filters: CatFilters = {}): Observable<Page<Cat>> {
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
    if (filters.color) {
      params = params.set('color', filters.color);
    }
    if (filters.sex) {
      params = params.set('sex', filters.sex);
    }
    if (filters.adopted !== undefined) {
      params = params.set('adopted', filters.adopted.toString());
    }

    return this.http.get<Page<Cat>>(this.apiUrl, { params });
  }

  getCatById(id: string): Observable<Cat> {
    return this.http.get<Cat>(`${this.apiUrl}/${id}`);
  }

  createCat(cat: CatRequest): Observable<Cat> {
    return this.http.post<Cat>(this.apiUrl, cat);
  }

  updateCat(id: string, cat: CatRequest): Observable<Cat> {
    return this.http.put<Cat>(`${this.apiUrl}/${id}`, cat);
  }

  deleteCat(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCatsByAdoptionStatus(adopted: boolean, page: number = 0, size: number = 12): Observable<Page<Cat>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Cat>>(`${this.apiUrl}/adopted/${adopted}`, { params });
  }

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/dashboard-summary`);
  }
}
