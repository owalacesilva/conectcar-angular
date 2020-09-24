import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { RecursosService }                             from 'app/services/recursos.service';
import { NgbModal, NgbModalRef }                       from '@ng-bootstrap/ng-bootstrap';
import { ModalAdicionarAdesivoComponent }              from './../index';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';

@Component({
  selector: 'app-ativacao-realizada',
  templateUrl: './ativacao-realizada.component.html',
  styleUrls: ['./ativacao-realizada.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AtivacaoRealizadaComponent implements AfterViewInit {

  constructor(
  	private R: RecursosService,
    private gtmService: GoogleTagManagerService
  ) { }

  ngAfterViewInit() {
		this.gtmService.sendPageView('area-logada/ativacao/sucesso');
  }
}
