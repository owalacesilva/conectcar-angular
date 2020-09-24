import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { RecursosService } from 'app/services/recursos.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';

import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { RegistrationComponent } from './../../registration.component';
import { RoutesFlowService } from 'app/services/routes-flow.service';

import { Masks } from 'app/masks';

@Component({
  selector: 'app-registration-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.less']
})
export class PhoneComponent implements AfterViewInit, OnInit {
  @ViewChild('phoneInput') phoneInput: ElementRef;
  @ViewChild('dddInput') dddInput: ElementRef;

  dddMask = Masks.ddd;
  mask = Masks.phone;

  ddd = new FormControl('');
  phone = new FormControl('');
  disabled = true
  fromOverview = false

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private registration: RegistrationComponent,
    private routesFlow: RoutesFlowService,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService
  ) {
    this.route.queryParams.subscribe(params => {
      this.fromOverview = params.r === '' || !!params.r;
    });

    const ddd = this.clienteService.getCache('DddCelular');
    const phone = this.clienteService.getCache('Celular');
    this.ddd.setValue(ddd);
    this.phone.setValue(phone);
    this.toggleDisabled();
  }

  ngOnInit() {
    this.registration.bgcontent  = 'image4';
    this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_queremos_te_conhecer') + "</h1><p>" + this.R.R('sidebar_desc_queremos_te_conhecer') + "</p>";
  }

  phoneValue() {
    return this.phone.value.replace(/[^\d]/g, '');
  }

  dddOnInput() {
    if (this.ddd.value.replace(/[^\d]/g, '').length === 2) {
      this.phoneInput.nativeElement.focus();
    }
    this.toggleDisabled();
  }

  toggleDisabled() {
    this.disabled = !(
      this.ddd.value.replace(/[^\d]/g, '').length === 2 &&
      this.phoneValue().length === 9 &&
      this.phone.value[0] === '9'
    );
  }

  ngAfterViewInit() {
    this.dddInput.nativeElement.focus();
  }

  back(e) {
    e.stopPropagation();
    e.preventDefault();
    history.back();
  }

  submit(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!this.disabled && this.phone.valid) {
      this.clienteService.AtualizaOuCache({
        DddCelular: this.ddd.value.replace(/\D*/g, ''),
        Celular: this.phone.value.replace(/\D*/g, ''),
      });

      this.gtmService.sendPageView('compra/celular');
      this.routesFlow.go(this.fromOverview);
    }
  }
}
