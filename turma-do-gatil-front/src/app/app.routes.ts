import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatsComponent } from './pages/cats/cats.component';
import { AdoptionsComponent } from './pages/adoptions/adoptions.component';
import { AdoptersComponent } from './pages/adopters/adopters.component';
import { SterilizationsComponent } from './pages/sterilizations/sterilizations.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'cats', 
    component: CatsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'adoptions', 
    component: AdoptionsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'adopters', 
    component: AdoptersComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'sterilizations', 
    component: SterilizationsComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
