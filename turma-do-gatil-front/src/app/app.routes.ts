import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GatosComponent } from './pages/gatos/gatos.component';
import { AdocoesComponent } from './pages/adocoes/adocoes.component';
import { AdotantesComponent } from './pages/adotantes/adotantes.component';
import { CastracoesComponent } from './pages/castracoes/castracoes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'gatos', component: GatosComponent },
  { path: 'adocoes', component: AdocoesComponent },
  { path: 'adotantes', component: AdotantesComponent },
  { path: 'castracoes', component: CastracoesComponent },
  { path: '**', redirectTo: '/home' }
];
