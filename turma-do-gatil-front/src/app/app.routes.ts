import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { GatosComponent } from './pages/gatos.component';
import { AdocoesComponent } from './pages/adocoes.component';
import { AdotantesComponent } from './pages/adotantes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'gatos', component: GatosComponent },
  { path: 'adocoes', component: AdocoesComponent },
  { path: 'adotantes', component: AdotantesComponent },
  { path: '**', redirectTo: '/home' }
];
