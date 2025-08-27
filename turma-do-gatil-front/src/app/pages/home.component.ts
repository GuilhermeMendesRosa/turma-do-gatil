import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1><i class="pi pi-home"></i> Dashboard</h1>
      <p>Bem-vindo ao sistema de gerenciamento da Turma do Gatil!</p>
      
      <div class="dashboard-grid">
        <div class="dashboard-card">
          <div class="card-header">
            <i class="pi pi-heart"></i>
            <h3>Gatos</h3>
          </div>
          <div class="card-content">
            <div class="metric">
              <span class="number">12</span>
              <span class="label">Disponíveis para adoção</span>
            </div>
          </div>
        </div>
        
        <div class="dashboard-card">
          <div class="card-header">
            <i class="pi pi-home"></i>
            <h3>Adoções</h3>
          </div>
          <div class="card-content">
            <div class="metric">
              <span class="number">5</span>
              <span class="label">Em processo</span>
            </div>
          </div>
        </div>
        
        <div class="dashboard-card">
          <div class="card-header">
            <i class="pi pi-users"></i>
            <h3>Adotantes</h3>
          </div>
          <div class="card-content">
            <div class="metric">
              <span class="number">28</span>
              <span class="label">Cadastrados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1rem;
    }
    
    h1 {
      color: var(--p-primary-color);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .dashboard-card {
      background: var(--p-surface-card);
      border-radius: 12px;
      border: 1px solid var(--p-surface-border);
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 2px 8px rgba(242, 187, 174, 0.15);
    }
    
    .dashboard-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(242, 187, 174, 0.25);
    }
    
    .card-header {
      background: linear-gradient(135deg, #F2BBAE, #E5A693);
      color: #2D2D2D;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .card-header i {
      font-size: 1.5rem;
      filter: drop-shadow(0 1px 2px rgba(45, 45, 45, 0.2));
    }
    
    .card-header h3 {
      margin: 0;
      font-weight: 600;
      text-shadow: 0 1px 2px rgba(45, 45, 45, 0.1);
    }
    
    .card-content {
      padding: 1.5rem;
    }
    
    .metric {
      text-align: center;
    }
    
    .number {
      display: block;
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--p-primary-color);
      margin-bottom: 0.5rem;
      text-shadow: 0 1px 2px rgba(242, 187, 174, 0.2);
    }
    
    .label {
      color: var(--p-text-color-secondary);
      font-size: 0.9rem;
    }
  `]
})
export class HomeComponent {

}
