import { Component, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { RecursosService } from 'app/services/recursos.service';
import { CustomValidators } from 'app/validators';
import * as store from 'store';

@Component({
  selector: 'app-alterar-senha-atual',
  templateUrl: './alterar-senha-atual.component.html',
  styleUrls: ['./alterar-senha-atual.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AlterarSenhaAtualComponent implements AfterViewInit {
  @ViewChild('passwordInput') passwordInput: ElementRef;
  password = new FormControl('', [Validators.required, CustomValidators.password]);
  passwordType = 'password'
  disabled = true

  constructor(
    private R: RecursosService,
    private router: Router,
  ) {}

  ngAfterViewInit() {
    this.passwordInput.nativeElement.focus();
  }

  passwordToggle() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
  }

  submit(e?) {
    store.set('oldpass', this.password.value);
    this.router.navigate(['/meu-conect/nova-senha']);
  }
}
