import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  ViewEncapsulation,
  ComponentFactoryResolver,
  ComponentFactory
} from '@angular/core';
import { PlatformLocation } from '@angular/common'
import { Animations } from 'app/animations'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LegalTermsComponent } from './components/legal-terms/legal-terms.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [ Animations.slideInOut ]
})
export class RegistrationComponent implements OnInit, AfterViewInit {
  step: string;
  direction = 'left';
  height = 0;

  @ViewChild('legalterms', { read: ViewContainerRef }) viewContainerLegalTerms: ViewContainerRef;

  private legalTermsComponentFactory;

  public bgcontent: string = null;
  public txtcontent: string;
  public visible = false;
  public full = false;
  private path: string;

  constructor(
    private elRef: ElementRef,
    private location: PlatformLocation,
    private route: ActivatedRoute,
    private ngbModal: NgbModal,
    private componentFactoryResolver: ComponentFactoryResolver) {

    this.route.url.subscribe(url => {
      if (url.length) {
        this.path = `/${url.join('/')}`;
      }
    });

    this.legalTermsComponentFactory = componentFactoryResolver.resolveComponentFactory(LegalTermsComponent);

    location.onPopState((e) => {
      this.direction = 'right';
      this.adjustHeight();
      setTimeout(() => { this.direction = 'left'; }, 1000);
    });

    this.visible = true;
  }

  resetScroll() {
    [0, 100, 300, 500].forEach(t => {
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      }, t)
    });
  }

  resize(event) {
    this.adjustHeight();
  }

  adjustHeight() {
    let holder = this.elRef.nativeElement.querySelector(`.holder.${this.step || 'cpf'}`);
    holder = holder || this.elRef.nativeElement.querySelector(`.holder`);
    const steps = this.elRef.nativeElement.querySelector('.steps');

    if (!holder || !steps) { return; }

    const height = Math.max(holder.scrollHeight, window.innerHeight - 100);
    steps.style['height'] = `${height}px`;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.step = params.get('step')

      if (this.step !== '') {
        document.body.classList.add('inputActive');
      }

      setTimeout(() => this.adjustHeight(), 100);
      this.resetScroll();
    });
  }

  ngAfterViewInit() {
    this.resetScroll();
    this.adjustHeight();
  }

  openLegalTerms() {
    const legalTermsComponentRef = this.viewContainerLegalTerms.createComponent(this.legalTermsComponentFactory);

    // setTimeout(() => {
    //   legalTermsComponentRef.instance.type = 'termos';
    // }, 10);
  }

  closeLegalTerms() {
    this.viewContainerLegalTerms.clear();
  }
}
