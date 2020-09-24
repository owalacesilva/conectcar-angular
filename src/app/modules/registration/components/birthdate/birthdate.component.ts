import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { RecursosService } from 'app/services/recursos.service';

import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { RegistrationComponent } from 'app/modules/registration/registration.component';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';
import { CustomValidators } from 'app/validators';

@Component({
  selector: 'app-registration-birthdate',
  templateUrl: './birthdate.component.html',
  styleUrls: ['./birthdate.component.less']
})
export class RegistrationBirthdateComponent implements AfterViewInit, OnInit {
  @ViewChild('dateInput') dateInput: ElementRef;
  @ViewChild('monthInput') monthInput: ElementRef;
  @ViewChild('yearInput') yearInput: ElementRef;

  date = new FormControl('');
  month = new FormControl('');
  year = new FormControl('');
  mask = [/\d/, /\d/]
  yearMask = [/\d/, /\d/, /\d/, /\d/]
  invalidYear = false
  yearBlur = false

  disabled = true
  fromOverview = false

  yearLength = () => this.year.value.replace(/\D*/g, '').length;

  constructor(
    private fbService: FacebookService,
    private router: Router,
    private route: ActivatedRoute,
    private routesFlow: RoutesFlowService,
    private clienteService: ClienteService,
    private registration: RegistrationComponent,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService
  ) {

    this.route.queryParams.subscribe(params => {
      this.fromOverview = params.r === '' || !!params.r;
    });

    const birthdate = (this.clienteService.getCache('DataDeNascimento') || '').split('/').filter(input => input !== '');
    if (birthdate.length === 3) {
      this.date.setValue(birthdate[0]);
      this.month.setValue(birthdate[1]);
      this.year.setValue(birthdate[2]);
      this.disabled = false;
    }
  }

  ngOnInit() {
    this.registration.bgcontent  = 'image4';
    this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_queremos_te_conhecer') + "</h1><p>" + this.R.R('sidebar_desc_queremos_te_conhecer') + "</p>";
  }

  ngAfterViewInit() {
    this.fbService.initFacebook();
    this.dateInput.nativeElement.focus();
  }

  back(e) {
    e.preventDefault();
    e.stopPropagation();
    history.back();
  }

  onDateInput() {
    this.yearBlur = false;
    if (this.date.value.replace(/[^\d]/g, '').length === 2 && this.date.value < 32) {
      this.monthInput.nativeElement.focus();
    }

    this.toggleDisabled()
  }

  onMonthInput() {
    this.yearBlur = false;
    if (this.month.value.replace(/[^\d]/g, '').length === 2 && this.month.value < 13) {
      this.yearInput.nativeElement.focus();
    }

    this.toggleDisabled()
  }

  onYearInput() {
    const year = this.year.value.replace(/[^\d]/g, '');
    this.invalidYear = (
      year.length !== 4 ||
      Number(year) < 1900 ||
      Number(year) < (new Date().getFullYear())
    );
    this.toggleDisabled()
  }

  toggleDisabled() {
    const year = this.year.value.replace(/\D*/g, '');
    this.disabled = !(
      this.date.value.length === 2 &&
      this.month.value.length === 2 &&
      this.date.value < 32 &&
      this.month.value < 13 &&
      year.length === 4 &&
      Number(year) > 1900 &&
      Number(year) < (new Date().getFullYear())
    );
  }

  submit(e) {
    e.preventDefault();

    if (this.disabled) {
      return;
    }

    const DataDeNascimento = `${this.year.value}-${this.month.value}-${this.date.value}`
    this.gtmService.sendPageView('compra/data-nascimento');
    this.clienteService.AtualizaOuCache({ DataDeNascimento });
    this.routesFlow.go(this.fromOverview);
  }
}
