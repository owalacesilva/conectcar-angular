import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { RecursosService } from 'app/services/recursos.service';
import { DialogService } from 'app/services/dialog.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RecargaService } from 'app/services/recarga.service';
import { ApiResponse } from 'app/models/api-response.model';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';
import { Animations } from 'app/animations';
import * as localStore from 'store';

@Component({
  selector: 'app-ponto-a-ponto',
  templateUrl: './ponto-a-ponto.component.html',
  styleUrls: ['./ponto-a-ponto.component.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [ Animations.slideInOut ]
})
export class PontoAPontoComponent implements OnInit, AfterViewInit {

  private step: string;
  private direction = 'left';
  private height = 0;

  constructor(
    private R: RecursosService,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private gtmService: GoogleTagManagerService
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.step = params.get('step');

      if (!this.step || this.step == '') {
        let cliente = localStore.get('cliente');

        if(!cliente.DataAdesaoPontoAPonto) {
          this.step = 'aderir';
        } else {
          this.step = 'cancelar-adesao';
        }
      }

      setTimeout(() => this.adjustHeight(), 100);
      this.resetScroll();
    });
  }

  ngAfterViewInit() {
    this.resetScroll();
    this.adjustHeight();
    this.gtmService.sendPageView();
  }

  resetScroll() {
    [0, 100, 300, 500].forEach(t => {
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      }, t)
    });
  }

  adjustHeight() {
    let holder = this.elRef.nativeElement.querySelector(`.holder.${this.step || 'aderir'}`);
    holder = holder || this.elRef.nativeElement.querySelector(`.holder`);
    const steps = this.elRef.nativeElement.querySelector('.steps');

    if (!holder || !steps) { return; }

    const height = Math.max(holder.scrollHeight, window.innerHeight - 100);
    steps.style['height'] = `${height}px`;
  }
}
