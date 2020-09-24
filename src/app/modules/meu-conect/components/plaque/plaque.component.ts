import { Component, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { RecursosService } from 'app/services/recursos.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalEditarPlaqueComponent } from './../index';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';
import * as store from 'store';

@Component({
  selector: 'app-plaque',
  templateUrl: './plaque.component.html',
  styleUrls: ['./plaque.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PlaqueComponent implements AfterViewInit {
  @ViewChild('gnplaca') gnplaca;
  placa: string;
  tagId: any;

  private modalRef: NgbModalRef;

  constructor(
    private _modalService: NgbModal,
    private router: Router,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService
  ) {
  }

  ngAfterViewInit() {
    const cli = store.get('cliente') || {};
    const tags = cli.TagsPreLiberacao || [];

    if (tags && tags.length > 0) {
      this.placa = tags[0].PlacaVeiculo;
      const placa = this.placa.split('-');
      this.gnplaca.plaque1.setValue(placa[0]);
      this.gnplaca.plaque2.setValue(placa[1]);
      console.log('-', tags[0]);
      this.tagId = tags[0].PreLiberacaoTagId;
    }
  }

  openModalEditarPlaque(): void {
    this.modalRef = this._modalService.open(ModalEditarPlaqueComponent, {
      windowClass: 'modal-expandido modal-editar-plaque',
      size: 'lg'
    });
  }

  next() {
    if (this.placa !== '') {
    	this.gtmService.sendPageView('area-logada/ativacao/confirme-placa');
      store.set('ativacao-online-placa', this.placa);
      store.set('ativacao-online-tagid', this.tagId);
      this.router.navigate(['/meu-conect/adesivo']);
    }
  }
}
