import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { MenuItem, MessageService } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { SterilizationService } from './services/sterilization.service';
import { User } from './models/auth.model';
import { SterilizationDays } from './models/sterilization.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule, MenubarModule, ButtonModule, AvatarModule, MenuModule, TooltipModule, ToastModule, DialogModule, InputNumberModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'turma-do-gatil-front';
  sidebarVisible: boolean = false;
  currentRoute: string = '';
  currentUser: User | null = null;
  isLoginPage: boolean = false;
  settingsModalVisible: boolean = false;
  minDays: number = 90;
  maxDays: number = 180;
  savingSettings: boolean = false;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private sterilizationService: SterilizationService,
    private messageService: MessageService
  ) {
    // Detectar mudanças de rota para atualizar o menu ativo
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('Rota atual:', event.url);
      this.currentRoute = event.url;
      this.isLoginPage = event.url.startsWith('/login') || event.url === '/';
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

  // Abre o modal de configurações
  openSettingsModal(): void {
    this.sterilizationService.getSterilizationDays().subscribe({
      next: (days: SterilizationDays) => {
        this.minDays = days.minDays;
        this.maxDays = days.maxDays;
        this.settingsModalVisible = true;
      },
      error: () => {
        // Se não conseguir buscar, usa valores padrão
        this.minDays = 90;
        this.maxDays = 180;
        this.settingsModalVisible = true;
      }
    });
  }

  // Fecha o modal de configurações
  closeSettingsModal(): void {
    this.settingsModalVisible = false;
  }

  // Salva as configurações
  saveSettings(): void {
    this.savingSettings = true;
    const days: SterilizationDays = {
      minDays: this.minDays,
      maxDays: this.maxDays
    };
    this.sterilizationService.setSterilizationDays(days).subscribe({
      next: () => {
        this.savingSettings = false;
        this.settingsModalVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Configurações de castração salvas com sucesso!'
        });
      },
      error: () => {
        this.savingSettings = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao salvar configurações. Tente novamente.'
        });
      }
    });
  }
}
