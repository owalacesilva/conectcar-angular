import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { RecursosService } from 'app/services/recursos.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalAdicionarAdesivoComponent } from './../index';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';
import * as store from 'store';

@Component({
  selector: 'app-adesivo',
  templateUrl: './adesivo.component.html',
  styleUrls: ['./adesivo.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AdesivoComponent implements AfterViewInit {
  disabled = true;
  private modalRef: NgbModalRef;
  tag = new FormControl('');
  adesivo: string;
  adesivoPrefix: string;
  adesivoSuffix: string;

  constructor(
    private _modalService: NgbModal,
    private router: Router,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService
  ) { }

  ngAfterViewInit() {
    const cli = store.get('cliente') || {};
    const tags = cli.TagsPreLiberacao || [];

    if (tags && tags.length > 0) {
      this.adesivo = String(tags[0].Numero);
      this.adesivoPrefix = this.adesivo.substring(0, this.adesivo.length - 3);
      this.adesivoSuffix = this.adesivo.substring(this.adesivo.length - 3, this.adesivo.length);
    }
  }

  openModalEditarPlaque(): void {
    this.modalRef = this._modalService.open(ModalAdicionarAdesivoComponent, {
      windowClass: 'modal-expandido modal-adicionar-adesivo',
      size: 'lg'
    });
  }

  next() {
    if (!this.disabled) {
    	this.gtmService.sendPageView('area-logada/ativacao/confirme-adesivo');
      store.set('ativacao-online-adesivo', this.adesivo);
      this.router.navigate(['/meu-conect/confirmar-placa-adesivo']);
    }
  }
}
