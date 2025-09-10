import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatsComponent } from './pages/cats/cats.component';
import { AdoptionsComponent } from './pages/adoptions/adoptions.component';
import { AdoptersComponent } from './pages/adopters/adopters.component';
import { SterilizationsComponent } from './pages/sterilizations/sterilizations.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'cats', component: CatsComponent },
  { path: 'adoptions', component: AdoptionsComponent },
  { path: 'adopters', component: AdoptersComponent },
  { path: 'sterilizations', component: SterilizationsComponent },
  { path: '**', redirectTo: '/home' }
];
