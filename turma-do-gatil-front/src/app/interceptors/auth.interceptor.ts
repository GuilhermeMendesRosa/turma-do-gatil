import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Interceptor HTTP funcional que adiciona o token JWT às requisições
 * e trata erros de autenticação
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // URLs que não precisam de autenticação
  const publicUrls = ['/auth/login', '/auth/register'];
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));
  
  // Se for uma URL pública, não adiciona o token
  if (isPublicUrl) {
    return next(req);
  }
  
  // Adiciona o token JWT ao header se o usuário estiver autenticado
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  // Processa a requisição e trata erros de autenticação
  return next(req).pipe(
    catchError(error => {
      // Se receber 401 (Unauthorized) ou 403 (Forbidden), faz logout automático
      if (error.status === 401 || error.status === 403) {
        authService.logout();
      }
      
      return throwError(() => error);
    })
  );
};
