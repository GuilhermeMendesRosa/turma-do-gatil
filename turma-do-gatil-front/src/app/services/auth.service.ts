import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, User } from '../models/auth.model';
import { environment } from '../../environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    const storedUser = this.getUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * Retorna o usuário atual
   */
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica se o usuário está autenticado
   */
  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Retorna o token JWT armazenado
   */
  public getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Realiza o login
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (!this.isBrowser) {
            return;
          }
          
          // Armazena o token e os dados do usuário
          localStorage.setItem(this.TOKEN_KEY, response.token);
          
          const user: User = {
            username: response.username,
            name: response.name,
            token: response.token
          };
          
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
          
          this.notificationService.showSuccess('Login realizado com sucesso!');
        })
      );
  }

  /**
   * Realiza o logout
   */
  logout(): void {
    if (this.isBrowser) {
      // Remove os dados do localStorage
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    
    // Atualiza o subject
    this.currentUserSubject.next(null);
    
    // Redireciona para a página de login
    this.router.navigate(['/login']);
    
    this.notificationService.showInfo('Logout realizado com sucesso!');
  }

  /**
   * Recupera o usuário do localStorage
   */
  private getUserFromStorage(): User | null {
    if (!this.isBrowser) {
      return null;
    }
    
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (error) {
        console.error('Erro ao recuperar usuário do localStorage:', error);
        return null;
      }
    }
    return null;
  }
}
