import { Routes } from '@angular/router';
import { PlanosComponent } from './planos.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/planos',
  },
  {
    path: 'planos',
    pathMatch: 'full',
    component: PlanosComponent,
  },
];
