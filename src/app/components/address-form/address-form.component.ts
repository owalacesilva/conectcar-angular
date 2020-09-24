import {
  Component,
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { DialogService } from 'app/services/dialog.service';
import { ApiResponse } from 'app/models/api-response.model';
import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { EnderecoService } from 'app/modules/registration/services/endereco.service';
import { PedidoService } from 'app/services/pedido.service';
import { Endereco } from 'app/modules/registration/models/pedido.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecursosService } from 'app/services/recursos.service';

import { Masks } from 'app/masks';
let cidades = [];

@Component({
  selector: 'cc-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.less']
})
export class AddressFormComponent implements AfterViewInit {
  @Output() endereco: Endereco;
  @Output() onResize = new EventEmitter<void>();

  @Input() dadosEndereco: Endereco;
  @Input() tipoEndereco = 'Entrega';

  @ViewChild('cepInput') cepInput: ElementRef;
  @ViewChild('tipoInput') tipoInput: ElementRef;
  @ViewChild('logradouroInput') logradouroInput: ElementRef;
  @ViewChild('numeroInput') numeroInput: ElementRef;
  @ViewChild('complementoInput') complementoInput: ElementRef;
  @ViewChild('bairroInput') bairroInput: ElementRef;
  @ViewChild('estadoInput') estadoInput: ElementRef;
  @ViewChild('cidadeInput') cidadeInput: ElementRef;

  mask = Masks.cep;

  cep = new FormControl('', [Validators.required]);
  tipo = new FormControl('', [Validators.required]);
  complemento = new FormControl('');
  logradouro = new FormControl('', [Validators.required]);
  numero = new FormControl('', [Validators.required]);
  bairro = new FormControl('', [Validators.required]);
  estado = new FormControl('', [Validators.required]);
  cidade = new FormControl('', [Validators.required]);

  @Output() disabled = true
  @Output() cepSearched = false
  loading = false

  estados = []
  cidades = []
  tipos = []
  ibge = null

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private dialogService: DialogService,
    private addressService: EnderecoService,
    private R: RecursosService
  ) {
    this.populateEstados();
    this.populateCidades();
  }

  ngAfterViewInit() {
    if (this.dadosEndereco) {
      this.populate(this.dadosEndereco);
    }
    if (this.cepInput && this.cepInput.nativeElement) {
      this.cepInput.nativeElement.focus();
    }
    this.onResize.emit();
    window.scrollTo(0, 0);
  }

  checkDisabled() {
    this.disabled = (
      (!this.cep.value || this.cep.value === '') ||
      (!this.bairro.value || this.bairro.value === '') ||
      (!this.logradouro.value || this.logradouro.value === '') ||
      (!this.cidade.value || this.cidade.value === '') ||
      (!this.estado.value || this.estado.value === '') ||
      (!this.numero.value || this.numero.value === '')
    );
    return this.disabled;
  }

  populate(Dados) {
    this.cepSearched = true;
    this.onResize.emit();

    if (!Dados) {
      return;
    }

    if (Dados.CEP) {
      this.cep.setValue(Dados.CEP);
    }

    if (Dados.Logradouro) {
      this.logradouro.setValue(Dados.Logradouro, { emitModelToViewChange: true });
      if (this.logradouroInput && this.logradouroInput.nativeElement) {
        this.logradouroInput.nativeElement.dispatchEvent(new Event('change'));
      }
    }

    if (Dados.Bairro) {
      this.bairro.setValue(Dados.Bairro, { emitModelToViewChange: true });
      if (this.bairroInput && this.bairroInput.nativeElement) {
        this.bairroInput.nativeElement.dispatchEvent(new Event('change'));
      }
    }

    if (Dados.IBGE) {
      this.ibge = Dados.IBGE;
    }

    if (Dados.Cidade) {
      this.cidade.setValue(Dados.Cidade, { emitModelToViewChange: true });
      if (this.cidadeInput && this.cidadeInput.nativeElement) {
        this.cidadeInput.nativeElement.dispatchEvent(new Event('change'));
      }
    }

    if (Dados.Estado) {
      this.estado.setValue(Dados.Estado, { emitModelToViewChange: true });
    }

    if (Dados.Numero) {
      this.numero.setValue(Dados.Numero, { emitModelToViewChange: true });
      if (this.numeroInput && this.numeroInput.nativeElement) {
        this.numeroInput.nativeElement.dispatchEvent(new Event('change'));
      }
    }

    if (Dados.Complemento) {
      this.complemento.setValue(Dados.Complemento, { emitModelToViewChange: true });
      if (this.complementoInput && this.complementoInput.nativeElement) {
        this.complementoInput.nativeElement.dispatchEvent(new Event('change'));
      }
    }

    this.update();
  }

  onCepFilled(e) {
    if (this.loading || !this.cep.value || this.cep.value.replace(/[^\d]/g, '').length !== 8) {
      return;
    }

    this.loading = true;

    const focusLogradouro = () => setTimeout(() => {
      if (this.logradouroInput && this.logradouroInput.nativeElement) {
        this.logradouroInput.nativeElement.focus();
      }
    }, 100);

    const error = (data?) => {
      this.loading = false;
      this.cepSearched = true;
      this.dialogService.showAlert({
        title: this.R.R('alerta_error_endereco_titulo') ,
        subtitle: this.R.R('alerta_error_endereco_subtitulo'),
        okLabel: this.R.R('alerta_error_endereco_ok'),
        icon: 'search',
        modal_address_error: true,
        full: false
      })
      .then(
        () => focusLogradouro(),
        () => focusLogradouro(),
      );
    };

    this.addressService
      .EnderecoPorCep(this.cep.value.replace(/\D*/g, ''))
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          if (Dados === null) {
            return error();
          }
          this.populate(Dados);
        },
        (err) => error(err),
        () => {
          this.cepSearched = true;
          this.loading = false;

          setTimeout(() => {
            if (this.numeroInput && this.numeroInput.nativeElement) {
              this.numeroInput.nativeElement.focus();
            }
          }, 100);
        }
      );
  }

  buscaCidades(text: Observable<string>) {
    return text
      .map(term => {
        if (term.length < 2) {
          return [];
        }
        return cidades.filter(v =>
          v && v.Cidade.toLowerCase().indexOf(term.toLowerCase()) > -1)
        .slice(0, 10)
      })
  }

  inputFormatter(term) {
    return term.Descricao ? term.Descricao : term;
  }

  resultFormatter(term) {
    return term.Descricao ? term.Descricao : term;
  }

  populateEstados() {
    this.addressService
      .Estados()
      .map(data => <ApiResponse>data.json())
      .subscribe(({ Dados }: ApiResponse) => {
        this.estados = Dados;
      });
  }

  populateCidades() {
    this.addressService
      .CidadesPorEstado(this.estado.value || 'SP')
      .map(data => <ApiResponse>data.json())
      .subscribe(({ Dados }: ApiResponse) => {
        this.cidades = Dados;
        cidades = Dados;
      });
  }

  fill() {
    this.cepSearched = true;
    this.cep.setValue(this.endereco.CEP);
    this.logradouro.setValue(this.endereco.Logradouro);
    this.complemento.setValue(this.endereco.Complemento);
    this.bairro.setValue(this.endereco.Bairro);
    this.cidade.setValue(this.endereco.Cidade);
    this.estado.setValue(this.endereco.Sigla);
    this.numero.setValue(this.endereco.Numero);
  }

  update() {
    this.endereco = {
      CEP: this.cep.value.replace(/\D*/g, ''),
      Logradouro: this.logradouro.value,
      Complemento: this.complemento.value,
      Bairro: this.bairro.value,
      Cidade: this.cidade.value,
      Estado: this.estado.value,
      Numero: this.numero.value,
      IBGE: this.ibge,
      Tipo: this.tipoEndereco,
    };
  }

  get data(): Endereco {
    this.update();
    return this.endereco;
  }
}
