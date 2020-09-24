import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RecursosService } from 'app/services/recursos.service';
import { DialogService } from 'app/services/dialog.service';
import { ContaService } from 'app/services/conta.service';
import { ApiResponse }  from 'app/models/api-response.model';
import { LoadingService } from 'app/services/loading.service';
import * as localStore from 'store';

@Component({
  selector: 'confirmar-adesao-ponto-a-ponto',
  templateUrl: './confirmar-adesao-ponto-a-ponto.component.html',
  styleUrls: ['./confirmar-adesao-ponto-a-ponto.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmarAdesaoPontoAPontoComponent {

	private hasPontoAPonto: boolean;

  constructor(
  	private dialogService: DialogService,
    private R: RecursosService, 
    private router: Router,
    private loadingService: LoadingService, 
    private contaService: ContaService 
  ) {
  	let cliente = localStore.get('cliente');

  	if( cliente.DataAdesaoPontoAPonto ) {
			this.router.navigate(['ponto-a-ponto', 'cancelar-adesao']);
  	}
  }

  /**
   * [subscribe description]
   */
  submit() {
  	this.loadingService.show();
	  this.contaService.postAdesaoPontoPonto({})
	    .map(a => a.json())
	    .subscribe(
	      ({ Dados }: ApiResponse) => {
	      	this.loadingService.destroy();

	      	if( Dados.Sucesso ) {
  					this.router.navigate(['ponto-a-ponto', 'adesao-confirmada']);
	      	} else {
	      		this.onError("Failed");
	      	}
	      },
	      (err) => this.onError(err));
  }

  /**
   * [back description]
   * 
   * @param {any} event [description]
   */
  back(event: any) {
    event.stopPropagation();
    event.preventDefault();

    history.back();
  }  

  /**
   * [onError description]
   * 
   * @param {[type]} err [description]
   */
  onError(err) {
    this.dialogService.showAlert({
      title: 'Houve um problema',
      subtitle: err
    });
  }
}
