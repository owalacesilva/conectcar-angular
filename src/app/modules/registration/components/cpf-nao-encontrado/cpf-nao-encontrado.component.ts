import { Component, OnInit } from '@angular/core';
import { RegistrationComponent } from './../../registration.component';
import { RecursosService } from 'app/services/recursos.service';

@Component({
  selector: 'app-login-cpf-nao-encontrado',
  templateUrl: './cpf-nao-encontrado.component.html',
  styleUrls: ['./cpf-nao-encontrado.component.less']
})
export class CpfNaoEncontradoComponent implements OnInit {
  constructor(
    private registration: RegistrationComponent,
    private R: RecursosService,
  ) {}

  ngOnInit() {
    this.registration.bgcontent  = 'image7';
    this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_bem_vindo_de_volta') + "</h1><p>" + this.R.R('sidebar_desc_acesse_seu_extrato_simplificado') + "</p>";
    this.registration.visible = false
  }
}
