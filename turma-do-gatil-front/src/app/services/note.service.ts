import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Note, NoteRequest } from '../models/note.model';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private readonly apiUrl = `${environment.apiUrl}/notes`;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  /**
   * Busca todas as anotações de um gato específico
   */
  getNotesByCatId(catId: string): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/cat/${catId}`).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  /**
   * Busca uma anotação específica por ID
   */
  getNoteById(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  /**
   * Cria uma nova anotação
   */
  createNote(note: NoteRequest): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  /**
   * Atualiza uma anotação existente
   */
  updateNote(id: string, note: NoteRequest): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${id}`, note).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  /**
   * Remove uma anotação
   */
  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }
}