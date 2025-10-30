import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { User } from './models/auth.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, MenubarModule, ButtonModule, AvatarModule, MenuModule, TooltipModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'turma-do-gatil-front';
  sidebarVisible: boolean = false;
  currentRoute: string = '';
  currentUser: User | null = null;
  isLoginPage: boolean = false;
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Detectar mudanças de rota para atualizar o menu ativo
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
      // Verifica se está na página de login (com ou sem query params)
      this.isLoginPage = event.url.startsWith('/login');
      // Garante que o sidebar esteja fechado na página de login
      if (this.isLoginPage) {
        this.sidebarVisible = false;
      }
    });
  }

  ngOnInit(): void {
    // Observa mudanças no usuário atual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
  
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-bar',
      routerLink: '/home'
    },
    {
      label: 'Gatos',
      icon: 'fas fa-cat',
      routerLink: '/cats'
    },
    {
      label: 'Castrações',
      icon: 'pi pi-briefcase',
      routerLink: '/sterilizations'
    },
    {
      label: 'Adoções',
      icon: 'pi pi-home',
      routerLink: '/adoptions'
    },
    {
      label: 'Adotantes',
      icon: 'pi pi-users',
      routerLink: '/adopters'
    }
  ];

  userMenuItems: MenuItem[] = [
    {
      label: 'Perfil',
      icon: 'pi pi-user'
    },
    {
      label: 'Configurações',
      icon: 'pi pi-cog'
    },
    {
      separator: true
    },
    {
      label: 'Sair',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  // Verifica se o item do menu está ativo
  isMenuItemActive(routerLink: string): boolean {
    return this.currentRoute === routerLink;
  }

  // Realiza o logout
  logout(): void {
    this.authService.logout();
  }

  // Retorna as iniciais do usuário para exibir no avatar
  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    const names = this.currentUser.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return this.currentUser.name[0].toUpperCase();
  }
}
