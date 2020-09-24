import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

import { DialogService } from 'app/services/dialog.service';
import { RecursosService } from 'app/services/recursos.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';

import { ApiResponse } from 'app/models/api-response.model';
import { AgendamentoService } from 'app/modules/registration/services/agendamento.service';
import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { EnderecoService } from 'app/modules/registration/services/endereco.service';
import { PlacaService } from 'app/modules/registration/services/placa.service';
import { Endereco } from 'app/modules/registration/models/pedido.model';
import { PedidoService } from 'app/services/pedido.service';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import { Agendamento } from 'app/modules/registration/models/agendamento.model';
import { FormaDeEnvio } from 'app/modules/registration/models/pedido.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationComponent } from './../../registration.component';
import { ModalAgendamentoComponent } from './../modal-agendamento/modal-agendamento.component';
import { ModalFreteGratisComponent } from './../modal-frete-gratis/modal-frete-gratis.component';

import Routes from 'app/configs/routes';
import { Masks } from 'app/masks';
import * as localStore from 'store';
import * as store from 'store';

@Component({
  selector: 'app-registration-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.less']
})
export class AddressComponent implements OnInit, AfterViewInit {
  @ViewChild('addressForm') addressForm;

  @Output() onResize = new EventEmitter<void>();

  @ViewChild('cepInput') cepInput: ElementRef;
  @ViewChild('tipoInput') tipoInput: ElementRef;
  @ViewChild('logradouroInput') logradouroInput: ElementRef;
  @ViewChild('numeroInput') numeroInput: ElementRef;
  @ViewChild('complementoInput') complementoInput: ElementRef;
  @ViewChild('bairroInput') bairroInput: ElementRef;
  @ViewChild('estadoInput') estadoInput: ElementRef;
  @ViewChild('cidadeInput') cidadeInput: ElementRef;

  /**
   * Referenci do Object Modal
   */
  private modalRef: NgbModalRef;

  mask = Masks.cep;

  dadosEndereco: Endereco;

  cep = new FormControl('', [Validators.required]);
  tipo = new FormControl('', [Validators.required]);
  complemento = new FormControl('');
  logradouro = new FormControl('', [Validators.required]);
  numero = new FormControl('', [Validators.required]);
  bairro = new FormControl('', [Validators.required]);
  estado = new FormControl('', [Validators.required]);
  cidade = new FormControl('', [Validators.required]);

  agendamentoListener = this.store.select('agendamentoSelecionado');
  agendamento: Agendamento;
  formaDeEnvio: FormaDeEnvio = {
    OperadorId: 1,
    EhAgendado: false,
    PrazoDeEntrega: 7,
  };

  cepSearched = false
  loading = false

  lockSearch = false

  estados = []
  cidades = []
  tipos = []
  ibge = null

  data = null
  data1 = null
  data2 = null

  fromOverview = false;
  ativacaoOffline = !!localStore.get('ativacao-offline');

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private scheduleService: AgendamentoService,
    private clienteService: ClienteService,
    private dialogService: DialogService,
    private addressService: EnderecoService,
    private orderService: PedidoService,
    private plaqueService: PlacaService,
    private store: Store<Agendamento>,
    private registration: RegistrationComponent,
    private routesFlow: RoutesFlowService,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService
  ) {
    this.plaqueService.loadCategorias();

    this.route.queryParams.subscribe(params => {
      this.fromOverview = params.r === '' || !!params.r;
    });

    const pedido = localStore.get('pedido') || {};
    if (pedido && pedido.Enderecos) {
      const endereco = pedido.Enderecos.find(e => e && e.Tipo === 'Entrega');

      if (endereco) {
        endereco.TipoLogradouro = endereco.TipoDeLogradouro || endereco.TipoLogradouro;
        this.dadosEndereco = endereco;
      }
    }

    this.onAgendamento();
  }

  onAgendamento(agendamento: any = localStore.get('endereco-agendamento')) {
    if (!agendamento || !agendamento.Operador) {
      return;
    }

    const operador = agendamento.Operador;
    delete operador.Agendamentos;
    this.formaDeEnvio = <FormaDeEnvio>operador;
    delete agendamento.Operador;

    this.formaDeEnvio.EhAgendado = true;
    this.formaDeEnvio.PrazoDeEntrega = 7;

    this.agendamento = agendamento;
    const Data = agendamento.Data.replace(/-/g, '\/').replace(/T.+/, '');

    const formattedData = Data.split('/');
    this.formaDeEnvio.Agendamento = {
      PeriodoDeEntrega: agendamento.Periodo,
      DataDeEntrega: `${formattedData[1]}/${formattedData[2]}/${formattedData[0]}`,
    };

    const datePipe = new DatePipe('pt-BR');
    const day = datePipe.transform(Data, 'd');
    const year = datePipe.transform(Data, 'y');
    const month = datePipe.transform(Data, 'MMMM');
    const weekDay = datePipe.transform(Data, 'EEEE');
    this.data1 = `${day} de ${month} de ${year}`;

    let period = '7h e 11h';
    if (agendamento.Periodo === 'Tarde') {
      period = '13h e 18h';
    } else if (agendamento.Periodo === 'Noite') {
      period = '18h e 20h';
    }

    this.data2 = `${weekDay}, entre as ${period}`;
  }

  ngOnInit() {
    this.registration.bgcontent  = 'image4';
		this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_queremos_te_conhecer') + "</h1><p>" + this.R.R('sidebar_desc_queremos_te_conhecer') + "</p>";
  }

  ngOnChange() {
    this.checkDisabled();
  }

  ngAfterViewInit() {
    this.onResize.emit();
  }

  /**
   * Ajusta o tamanho do holder de cada passo do processo
   * ====================================================
   */
  resize($event) {
    this.onResize.emit();
  }

  checkDisabled() {
    return this.addressForm.checkDisabled();
  }

  back(e) {
    e.stopPropagation();
    e.preventDefault();
    history.back();
  }

  clear() {
    this.modalRef = this.modalService.open(ModalFreteGratisComponent, {
      windowClass: 'modal-expandido modal-frete-gratis',
      size: 'lg'
    });
    this.modalRef.result
    .then(
      result => {
        this.formaDeEnvio = {
          OperadorId: 1,
          EhAgendado: false,
          PrazoDeEntrega: 7,
        };
        this.data1 = null;
        this.data2 = null;
        store.remove('endereco-agendamento');
      }
    )
  }

  createPedido() {
    const Enderecos = [this.addressForm.data];
    const data: any = {
      Enderecos,
    };

    const ativacaoOffline = !!store.get('ativacao-offline');
    data.Ativacao = ativacaoOffline;

    if (ativacaoOffline) {
      return this.orderService.atualizaCache(data);
    }

    data.FormaDeEnvio = this.formaDeEnvio;
    this.orderService.Atualiza(data);
  }

  submit(e) {
    e.stopPropagation();
    e.preventDefault();

    if (this.checkDisabled()) {
      return;
    }

    this.createPedido();

    if (this.fromOverview) {
      return history.back();
    }

    this.gtmService.sendPageView('compra/endereco-entrega');

    const veiculos = store.get('veiculos') || [];
    const to = veiculos && veiculos.length > 0 ? Routes.comprarEixo : null;
    this.routesFlow.go(false, to);
  }

  openModalAgendamento() {
    this.modalRef = this.modalService.open(ModalAgendamentoComponent, {
      windowClass: 'modal-expandido modal-agendamento',
      size: 'lg'
    });
    this.modalRef.result.then(() => this.onAgendamento());
  }
}
