import { Routes } from '@angular/router';
import { ConfirmationComponent } from './confirmation.component';

export const routes: Routes = [
  {
    path: 'confirmation',
    pathMatch: 'full',
    component: ConfirmationComponent,
  },
];
