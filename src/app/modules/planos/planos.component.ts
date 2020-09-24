import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject, Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { Animations } from 'app/animations'
import { ProdutosService } from 'app/services/produtos.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';
import { Produto } from 'app/models/produto.model';
import { DialogService } from 'app/services/dialog.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComoFuncionaComponent } from 'app/components/modal-como-funciona/modal-como-funciona.component';
import { environment } from 'environments/environment'
import { RecursosService } from 'app/services/recursos.service';
import * as store from 'store';

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [ Animations.slideInOutCards ],
  providers: [ NgbModal, GoogleTagManagerService ]
})
export class PlanosComponent implements OnInit {
  @ViewChild('modalComoFunciona') modalComoFunciona: ElementRef;

  private modalRef: NgbModalRef;

  loggedIn: Observable<boolean>;
  produtos: Observable<Produto[]>;
  modalId: number;
  slideCount = 0;
  slideIndex = 0;
  direction = 'right';
  loading = true;

  constructor(
  	private R: RecursosService, 
    private _modalService: NgbModal,
    private dialogService: DialogService,
    private productsService: ProdutosService,
    private store: Store<Produto>,
    private route: ActivatedRoute,
    private router: Router,
    private gtmService: GoogleTagManagerService
  ) {}

  next() {
    if (this.slideIndex === 0) {
      this.direction = 'left';
      this.slideIndex += 1;
    }
  }

  prev() {
    if (this.slideIndex > 0) {
      this.direction = 'right';
      this.slideIndex -= 1;
    }
  }

  swipeClick(index: any) {
    if (index === 0) {
      return this.prev();
    }
    if (index === 1) {
      return this.next();
    }
  }

  ngOnInit() {
    this.produtos = this.store.select('products');
    this.loggedIn = this.store.select('authentication');
    this.produtos.subscribe((val) => {
      if (val.length) {
        this.loading = false;
        if (!store.get('comoFuncionaModal')) {
          this.openModalComoFuncionam();
          store.set('comoFuncionaModal', 'true');
        }
      }
      this.slideCount = val.length;
      // this.slideIndex = val.length - 1;
      this.slideIndex = 0;
    });

    const params: any = this.route.snapshot.queryParams;
    const cupomName = environment.cupomName;
    const cupom = params[cupomName];

    if (cupom) {
      store.set('cupom', cupomName);
    } else {
      store.remove('cupom');
    }
    this.productsService.loadLista(cupom);
  }

  slideInOut(index: any) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(window.navigator.userAgent)) {
      // Take the user to a different screen here.
      return this.slideIndex === index ? 'in' : 'out_' + this.direction;
    } else {
      return null;
    }
  }

  openModalComoFuncionam(): void {
    this.modalRef = this._modalService.open(ModalComoFuncionaComponent, {
      windowClass: 'modal-expandido modal-como-funciona',
      size: 'lg'
    });
  }
}
