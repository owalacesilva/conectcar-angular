import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration.component';
import { AppLoginComponent } from './components/applogin/applogin.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';

export const routes: Routes = [
  {
    path: 'cadastro',
    pathMatch: 'full',
    component: RegistrationComponent,
  },
  {
    path: 'cadastro/:step',
    pathMatch: 'full',
    component: RegistrationComponent,
  },
  {
    path: 'comprar/:step',
    pathMatch: 'full',
    component: RegistrationComponent,
  },
  {
    path: 'ativar/:step',
    pathMatch: 'full',
    component: RegistrationComponent,
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: RegistrationComponent,
  },
  {
    path: 'login/:step',
    pathMatch: 'full',
    component: RegistrationComponent,
  },
  {
    path: 'logout',
    pathMatch: 'full',
    component: LogoutComponent,
  },
  {
    path: 'esqueci',
    pathMatch: 'full',
    component: RegistrationComponent,
  },
  {
    path: 'esqueci/t/:token',
    pathMatch: 'full',
    component: RegistrationComponent,
  },
  {
    path: 'app/login',
    pathMatch: 'full',
    component: AppLoginComponent,
  },
];
