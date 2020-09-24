import { Component, Input, AfterViewInit, ViewEncapsulation, Injectable } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

import { FeatureToggleService } from 'app/services/featureToggle.service';
import { RecursosService } from 'app/services/recursos.service';
import { AgendamentoService } from 'app/modules/registration/services/agendamento.service';
import { FormaDeEnvio } from 'app/modules/registration/models/pedido.model';
import { ApiResponse } from 'app/models/api-response.model';
import { HttpError } from 'app/services/http.service';

import * as store from 'store';
import * as moment from 'moment';
import * as locales from 'moment/min/locales';

moment.locale('pt-br');

const I18N_VALUES = {
  'pt-br': {
    weekdays: ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'],
    months: ['Janeiro', 'Fevereio', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  }
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'pt-br';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
}

@Component({
  selector: 'cc-modal-agendamento',
  templateUrl: './modal-agendamento.component.html',
  styleUrls: ['./modal-agendamento.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
})
export class ModalAgendamentoComponent implements AfterViewInit {
  @Input() close: Function;
  loading = true;
  disabled = true;
  model = {
    date: null,
    hour: null,
  };

  dias = [];
  minDate = null;
  maxDate = null;
  operador: FormaDeEnvio;
  lastStep = false;

  format1Passo = null;
  format2Passo = null;

  constructor(
    private _activeModal: NgbActiveModal,
    private agendamentoService: AgendamentoService,
    private router: Router,
    private httpError: HttpError,
    private ft: FeatureToggleService,
    private R: RecursosService,
  ) {
    if (this.ft.Check('Compra', 'AgendamentoEntregas')) {
      return;
    }
    this.getDays();
  }

  roundifyButton() {
    const days = document.querySelectorAll('.ngb-dp-day .btn-light');
    Array.prototype.forEach.call(days, (day) => {
      day.style.borderRadius = '50%';
    });
  }

  ngAfterViewInit() {
    this.roundifyButton();
  }

  getDays() {
    this
      .agendamentoService
      .DiasUteis(store.get('cep'))
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => this.onDiasUteis(Dados),
        err => {
          this.loading = false;
          this.httpError.run(err)
        },
      )
  }

  parseAgendamento(agendamento: any) {
    const d = new Date(agendamento.Data.replace(/-/g, '\/').replace(/T.+/, ''));
    return {
      raw: agendamento.Data,
      periods: agendamento.Periods,

      day: d.getUTCDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    };
  }

  onDiasUteis(dias: any) {
    if (!dias || !dias.Operadores || dias.Operadores.length < 1) {
      return;
    }

    const operador = dias.Operadores[0]
    const agendamentos = operador.Agendamentos || [];

    this.dias = agendamentos
      .filter(dia => !!dia)
      .map(dia => this.parseAgendamento(dia));

    this.operador = <FormaDeEnvio>operador;
    this.operador.OperadorId = operador.Id;

    if (this.dias.length) {
      this.minDate = this.dias[0];
      this.maxDate = this.dias[this.dias.length - 1];
    }

    this.roundifyButton();
    this.loading = false;
  }

  showDatePick() {
    this.disabled = false;
    const date = new Date(this.model.date.year, this.model.date.month - 1, this.model.date.day);
    this.format1Passo = moment(date).format('LL');
    this.format2Passo = moment(date).format('dddd');
  }

  enableSubmit() {
    this.disabled = false;
  }

  dia() {
    const dia = this.dias.find(d =>
      d.day === this.model.date.day &&
      d.month === this.model.date.month &&
      d.year === this.model.date.year
    );
    return dia;
  }

  nextStep(selectedDate) {
    if (this.model.date === null) {
      return;
    }

    if (!this.lastStep) {
      this.lastStep = true;
      this.disabled = true;
    } else {
      this.submit();
    }
  }

  submit(e?) {
    if (e) {
      e.preventDefault();
    }

    if (this.model.hour === null) {
      return;
    }

    store.set('endereco-agendamento', {
      Operador: this.operador,
      OperadorId: this.operador.OperadorId,
      EhAgendado: true,
      Periodo: this.model.hour,
      Data: this.dia().raw,
    });
    setTimeout(() => this._activeModal.close(), 0);
  }
}
