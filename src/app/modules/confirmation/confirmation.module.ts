import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './confirmation.component';
import { ComponentsModule } from 'app/components/index';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routes } from './confirmation.router';

@NgModule({
  declarations: [
    ConfirmationComponent
  ],
  exports: [
    ConfirmationComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
    RouterModule,
    NgbModule,
  ]
})
export class ConfirmationModule {}
