import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardSummary } from '../../models/dashboard.model';
import { CatService } from '../../services/cat.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dashboardData: DashboardSummary | null = null;
  loading = true;
  error: string | null = null;

  constructor(private catService: CatService) {}

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
}
