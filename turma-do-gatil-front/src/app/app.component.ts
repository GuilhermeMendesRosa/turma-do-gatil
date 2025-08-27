import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';

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
  
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-bar',
      routerLink: '/home'
    },
    {
      label: 'Gatos',
      icon: 'fas fa-cat',
      routerLink: '/gatos'
    },
    {
      label: 'Castrações',
      icon: 'pi pi-briefcase',
      routerLink: '/castracoes'
    },
    {
      label: 'Adoções',
      icon: 'pi pi-home',
      routerLink: '/adocoes'
    },
    {
      label: 'Adotantes',
      icon: 'pi pi-users',
      routerLink: '/adotantes'
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
}
