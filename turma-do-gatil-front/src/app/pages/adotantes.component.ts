import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adotantes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1><i class="pi pi-users"></i> Adotantes</h1>
      <p>Página para gerenciar informações dos adotantes.</p>
      
      <div class="content-card">
        <h3>Cadastro de Adotantes</h3>
        <p>Aqui você poderá visualizar e gerenciar o cadastro das pessoas interessadas em adotar.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1rem;
    }
    
    h1 {
      color: var(--primary-color);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .content-card {
      background: var(--surface-card);
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid var(--surface-border);
      margin-top: 1rem;
    }
    
    .content-card h3 {
      margin-top: 0;
      color: var(--text-color);
    }
  `]
})
export class AdotantesComponent {

}
