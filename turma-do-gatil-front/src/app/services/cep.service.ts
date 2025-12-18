import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface CepAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private readonly viaCepUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  searchCep(cep: string): Observable<CepAddress | null> {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return of(null);
    }

    return this.http.get<ViaCepResponse>(`${this.viaCepUrl}/${cleanCep}/json`).pipe(
      map(response => {
        if (response.erro) {
          return null;
        }
        return {
          street: response.logradouro,
          neighborhood: response.bairro,
          city: response.localidade,
          state: response.uf
        };
      }),
      catchError(() => of(null))
    );
  }
}
