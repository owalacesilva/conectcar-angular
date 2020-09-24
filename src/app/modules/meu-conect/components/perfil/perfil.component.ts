import {
  Component,
  ElementRef,
  ViewEncapsulation,
  AfterViewInit,
  OnInit,
  ViewChild,
  Input,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '@angular/http'
import { HttpClient, HttpRequest, HttpResponse, HttpHeaderResponse, HttpEvent, HttpEventType } from '@angular/common/http'
import { RecursosService } from 'app/services/recursos.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { LoadingService } from 'app/services/loading.service';
import { FormControl, Validators } from '@angular/forms';
import { Masks } from 'app/masks';
import { Animations } from 'app/animations';
import { FeatureToggleService } from 'app/services/featureToggle.service';
import { ApiResponse } from 'app/models/api-response.model';
import { FileUploader } from 'angular-file';

import * as orientImg from 'exif-orientation-image';
import * as store from 'store';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [ Animations.slideFromTop ],
})
export class PerfilComponent implements OnInit, AfterViewInit  {
  httpEvent: HttpEvent<Event>

  avatarLoading = false;
  avatarUrl: string = store.get('avatar') || null;
  file: File = null;
  progress = 0.0;

  @ViewChild('header') header;
  @ViewChild('avatar') avatar: ElementRef;
  @ViewChild('nomeInput') nomeInput: ElementRef;
  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('dddInput') dddInput: ElementRef;
  @ViewChild('celularInput') celularInput: ElementRef;
  @ViewChild('nascimentoInput') nascimentoInput: ElementRef;
  @ViewChild('cpfInput') cpfInput: ElementRef;
  @ViewChild('maeInput') maeInput: ElementRef;
  @ViewChild('addressForm') addressForm;

  @Output() disabled = true;

  nome = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required]);
  mae = new FormControl('');
  ddd = new FormControl('');
  celular = new FormControl('', [Validators.required]);
  nascimento = new FormControl('', [Validators.required]);
  cpf = new FormControl({value: '', disabled: true}, [Validators.required]);
  mask_cpf = Masks.cpf;
  mask_celular = Masks.phone;

  cliente = store.get('cliente') || {};
  endereco = (this.cliente.Enderecos || [])[0];
  loading = true;

  constructor(
    private router: Router,
    private R: RecursosService,
    private ft: FeatureToggleService,
    private loadingService: LoadingService,
    private clienteService: ClienteService,
  ) {
    if (this.ft.Check('Perfil', 'EdicaoDados')) {
      return;
    }

    this.clienteService.loadFoto((foto: string) => {
      this.avatarUrl = foto;
      this.avatar.nativeElement.style.backgroundImage = `url(${this.avatarUrl})`;
      this.header.changeAvatar(this.avatarUrl);
    });

    this
      .clienteService
      .PorCpf(store.get('cpf'))
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          this.cliente = Dados;
          this.endereco = (this.cliente.Enderecos || [])[0];
          this.updateCache();
          this.fillValues();
        }
      )
  }

  fillValues() {
    this.nome.setValue(this.cliente.NomeCompleto);
    this.mae.setValue(this.cliente.NomeDaMae);
    this.email.setValue(this.cliente.Email);
    this.ddd.setValue(this.cliente.DDD);
    this.celular.setValue(this.cliente.Celular);
    this.nascimento.setValue(this.cliente.DataDeNascimento);
    this.cpf.setValue(store.get('cpf'));

    if (this.endereco && this.addressForm && this.addressForm.cep) {
      this.addressForm.endereco = this.endereco;
      this.addressForm.fill();
    }
  }

  ngOnInit() {
    this.fillValues();
  }

  ngAfterViewInit() {
    this.fillValues();

    if (this.avatarUrl && this.avatar && this.avatar.nativeElement) {
      setTimeout(() => {
        this.avatar.nativeElement.style.backgroundImage = `url('${this.avatarUrl}')`
        this.header.changeAvatar(this.avatarUrl);
      }, 10);
    }
  }

  onClientUpdated() {
    const addr = this.addressForm.data;

    const enderecos = this.cliente.Enderecos || [];
    const EnderecoId = (enderecos[0] || {}).EnderecoId || null;

    this
      .clienteService
      .CriaOuAtualizaEndereco({
        EnderecoId,
        ClienteId: store.get('clienteId'),
        CEP: addr.CEP,
        Logradouro: addr.Logradouro,
        Numero: addr.Numero,
        Complemento: addr.Complemento,
        Bairro: addr.Bairro,
        TipoEndereco: 'Residencial',
        CodigoIBGE: addr.IBGE,
        NomeCidade: addr.Cidade,
        Estado: addr.Estado,
      })
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          if (Dados || Dados.Sucesso) {
            const toast = document.querySelector('.barra-sucesso');
            setTimeout(() => toast.classList.remove('active'), 2000);
            toast.classList.add('active');
            this.loadingService.destroy();
          }
        },
        err => {
          this.loadingService.destroy();
        }
      );
  }

  updateCache() {
    const cli = store.get('cliente') || {};
    const newCli = Object.assign({}, cli, {
      NomeCompleto: this.nome.value,
      Email: this.email.value,
      DddCelular: this.ddd.value,
      Celular: this.celular.value.replace(/\D*/g, ''),
      DataDeNascimento: this.nascimento.value,
      NomeDaMae: this.mae.value,
    });
    store.set('cliente', newCli);
  }

  uploadFile() {
    this.avatarLoading = true;

    if (this.file) {
      this
        .clienteService
        .UploadFoto(this.file)
        .subscribe(event => {
          if (event instanceof HttpHeaderResponse) {
            this.header.changeAvatar(this.avatarUrl);
            store.set('avatar', this.avatarUrl);
            this.avatarLoading = false;
            this.httpEvent = null;
            this.progress = 0;
            return;
          }

          this.httpEvent = <HttpEvent<Event>>event;
        });
    }
  }

  onFile(e) {
    if (e && e.length) {
      orientImg(e[0], (err, img) => {
        this.avatarUrl = img.toDataURL();
        this.avatar.nativeElement.style.backgroundImage = `url(${this.avatarUrl})`;
        this.uploadFile();
      });
    }
  }

  submit() {
    this.loadingService.show();

    this
      .clienteService
      .Atualiza({
        ClienteId: store.get('clienteId'),
        NomeCompleto: this.nome.value,
        Email: this.email.value,
        DddCelular: this.ddd.value,
        Celular: this.celular.value.replace(/\D*/g, ''),
        DataDeNascimento: this.nascimento.value,
        NomeDaMae: this.mae.value,
        Enderecos: [this.addressForm.data],
      })
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          if (Dados || Dados.Sucesso) {
            this.updateCache();
            this.onClientUpdated();
          }
        },
        err => {
          this.loadingService.destroy();
        }
      )
  }
}
