import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { ApiResponse } from 'app/models/api-response.model';
import { AuthenticationService } from 'app/modules/registration/services//authentication.service';
import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';

import { CustomValidators } from 'app/validators';
import { Masks } from 'app/masks';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as store from 'store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [ GoogleTagManagerService ]
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('cpfInput') cpfInput: ElementRef;
  mask = Masks.cpf;
  cpf = new FormControl('', [CustomValidators.cpf])
  password = new FormControl('')
  showValidation = false
  loading = false

  constructor(
    private modalService: NgbModal,
    private facebookService: FacebookService,
    private clienteService: ClienteService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private gtmService: GoogleTagManagerService
  ) {

    if (store.get('token')) {
      this.router.navigate(['/pedidos']);
    }
  }

  ngAfterViewInit() {
  	this.gtmService.sendPageView('login');	
  }

  back(e) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/pedidos']);
  }

  submit(e) {
    const cpf = this.cpfInput.nativeElement.value.replace(/\D*/g, '');

    this.authenticationService.login(cpf, this.password.value)
      .map(data => <ApiResponse>data.json())
      .subscribe(({ Dados }: ApiResponse) => {
        store.set('token', Dados.TokenDeSeguranca);

        this.clienteService.PorCpf(cpf)
          .map(data => <ApiResponse>data.json())
          .subscribe(
            (data: ApiResponse) => {
              store.set('clienteId', data.Dados.ClienteId);
              this.router.navigate(['/pedidos']);
            });
      });
  }
}
