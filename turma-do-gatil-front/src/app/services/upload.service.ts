import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NotificationService } from './notification.service';

export interface UploadResponse {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly apiUrl = `${environment.apiUrl}/images/upload`;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  /**
   * Faz upload de uma imagem para o S3
   * @param file Arquivo de imagem a ser enviado
   * @returns Observable com a URL da imagem no S3
   */
  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    // Não definir Content-Type manualmente, deixar o browser definir com boundary
    return this.http.post<UploadResponse>(this.apiUrl, formData).pipe(
      catchError(error => {
        this.notificationService.showHttpError(error);
        throw error;
      })
    );
  }

  /**
   * Valida se o arquivo é uma imagem válida
   * @param file Arquivo a ser validado
   * @returns true se for uma imagem válida, false caso contrário
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de arquivo inválido. Apenas JPEG, PNG, GIF e WEBP são permitidos.'
      };
    }

    // Validar tamanho do arquivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Arquivo muito grande. O tamanho máximo é 5MB.'
      };
    }

    return { valid: true };
  }
}
