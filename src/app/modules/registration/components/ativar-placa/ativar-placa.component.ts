import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationComponent } from 'app/modules/registration/registration.component';
import { RecursosService } from 'app/services/recursos.service';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import * as store from 'store';

@Component({
  selector: 'app-ativar-placa',
  templateUrl: './ativar-placa.component.html',
  styleUrls: ['./ativar-placa.component.less']
})
export class AtivarPlacaComponent implements OnInit {
  @ViewChild('gnplaca') gnplaca;

  constructor(
    private router: Router,
    private registration: RegistrationComponent,
    private routesFlow: RoutesFlowService,
    private R: RecursosService,
  ) {}

  ngOnInit() {
    this.registration.visible = false;
    this.registration.bgcontent  = 'image4';
    this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_queremos_te_conhecer') + "</h1><p>" + this.R.R('sidebar_desc_queremos_te_conhecer') + "</p>";
  }

  get placa(): string {
    return `${this.gnplaca.plaque1.value}-${this.gnplaca.plaque2.value}`
  }

  add() {
    if (this.gnplaca.disabled) {
      return;
    }

    store.set('ativar-placa', this.placa);
    this.routesFlow.go();
  }
}
