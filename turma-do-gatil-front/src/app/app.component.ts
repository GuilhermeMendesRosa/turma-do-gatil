import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, MenubarModule, ButtonModule, AvatarModule, MenuModule, TooltipModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'turma-do-gatil-front';
  sidebarVisible: boolean = false;
  currentRoute: string = '';
  
  constructor(private router: Router) {
    // Detectar mudanças de rota para atualizar o menu ativo
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
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
      icon: 'pi pi-sign-out'
    }
  ];

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  // Verifica se o item do menu está ativo
  isMenuItemActive(routerLink: string): boolean {
    return this.currentRoute === routerLink;
  }
}
