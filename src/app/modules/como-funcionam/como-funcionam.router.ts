import { Routes }                 from '@angular/router';
import { ComoFuncionamComponent } from './como-funcionam.component';

export const routes: Routes = [
  {
    path: 'como-funcionam',
    pathMatch: 'full',
    component: ComoFuncionamComponent,
  },
];
