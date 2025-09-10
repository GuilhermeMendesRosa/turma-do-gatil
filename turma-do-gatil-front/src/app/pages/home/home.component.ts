import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DashboardSummary } from '../../models/dashboard.model';
import { CatService } from '../../services/cat.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dashboardData: DashboardSummary | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private catService: CatService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.catService.getDashboardSummary().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados do dashboard:', error);
        this.error = 'Erro ao carregar dados do dashboard. Tente novamente.';
        this.loading = false;
      }
    });
  }

  getColorDisplayName(color: string): string {
    const colorMap: { [key: string]: string } = {
      'WHITE': 'Branco',
      'BLACK': 'Preto',
      'GRAY': 'Cinza',
      'BROWN': 'Marrom',
      'ORANGE': 'Laranja',
      'MIXED': 'Misto',
      'CALICO': 'Tricolor',
      'TABBY': 'Rajado',
      'SIAMESE': 'Siamês',
      'OTHER': 'Outro'
    };
    return colorMap[color] || color;
  }

  getSexDisplayName(sex: string): string {
    return sex === 'MALE' ? 'Macho' : 'Fêmea';
  }

  getStatusDisplayName(status: string): string {
    const statusMap: { [key: string]: string } = {
      'SCHEDULED': 'Agendada',
      'COMPLETED': 'Concluída',
      'CANCELED': 'Cancelada'
    };
    return statusMap[status] || status;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  // Métodos para testar os toasts
  testSuccessToast(): void {
    this.notificationService.showSuccess('Teste de toast de sucesso!', 'Este é um exemplo de notificação de sucesso.');
  }

  testErrorToast(): void {
    this.notificationService.showError('Teste de toast de erro!', 'Este é um exemplo de notificação de erro.');
  }

  testWarningToast(): void {
    this.notificationService.showWarning('Teste de toast de aviso!', 'Este é um exemplo de notificação de aviso.');
  }

  testInfoToast(): void {
    this.notificationService.showInfo('Teste de toast de informação!', 'Este é um exemplo de notificação informativa.');
  }
}
