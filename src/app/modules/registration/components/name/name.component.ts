import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { RecursosService } from 'app/services/recursos.service';

import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';

import { CustomValidators } from 'app/validators';
import { RegistrationComponent } from './../../registration.component';

@Component({
  selector: 'app-registration-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.less']
})
export class NameComponent implements AfterViewInit, OnInit {
  @ViewChild('nameInput') nameInput: ElementRef;

  name = new FormControl('', [Validators.required, CustomValidators.names]);
  showValidation = false
  disabled = true
  initialized = false
  fromOverview = false

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private registration: RegistrationComponent,
    private routesFlow: RoutesFlowService,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService
  ) {
    if (!this.registration.visible) {
      this.registration.visible = true;
    }

    this.route.queryParams.subscribe(params => {
      this.fromOverview = params.r === '' || !!params.r;
    });

    const name = this.clienteService.getCache('NomeCompleto');
    if (name.length) {
      this.disabled = false;
      this.name.setValue(name);
    }
  }

  ngOnInit() {
    this.registration.bgcontent  = 'image4';
    this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_queremos_te_conhecer') + "</h1><p>" + this.R.R('sidebar_desc_queremos_te_conhecer') + "</p>";
  }

  ngAfterViewInit() {
    this.nameInput.nativeElement.focus();
    this.gtmService.sendPageView();
  }

  back(e) {
    e.stopPropagation();
    e.preventDefault();
    history.back();
  }

  submit(e) {
    if (this.name.valid) {
      this.clienteService.AtualizaOuCache({ NomeCompleto: this.name.value });
      this.routesFlow.go(this.fromOverview);
    }
    e.stopPropagation();
    e.preventDefault();
  }
}
