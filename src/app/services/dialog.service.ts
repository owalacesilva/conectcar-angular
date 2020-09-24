import {
  Component, ViewChild, TemplateRef, Injectable, ComponentFactoryResolver, ApplicationRef,
  ReflectiveInjector, EmbeddedViewRef, Type, Optional, Input
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
    <ng-template #content let-c="close" let-d="dismiss">
      <div class="modal-window alert dialog-modal" id="test-dialog">
        <div (click)="d()" class="voltar"><a></a></div>
        <span class="ico {{ icon }}"></span>
        <h2 [innerHTML]="title"></h2>
        <h3 [innerHTML]="subtitle"></h3>
        <button *ngIf="cancelLabel" (click)="d()">{{cancelLabel}}</button>
        <button *ngIf="okLabel" (click)="c()">{{okLabel}}</button>
        <button *ngIf="retryLabel && retryAction" (click)="c(); retry()">{{retryLabel}}</button>
      </div>
    </ng-template>
  `
})
export class AlertComponent {
  @ViewChild('content') template: TemplateRef<string>;
  @Input() icon: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() iconType: string;
  @Input() okLabel: string;
  @Input() retryLabel: string;
  @Input() retryAction: Function;
  @Input() cancelLabel: string;

  retry() {
    if (this.retryAction) {
      this.retryAction();
    }
  }
}

@Injectable()
export class DialogService {
  comp;

  constructor(
    private resolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private modalService: NgbModal) {}

  showAlert(options: any) {
    const resolvedInputs = ReflectiveInjector.resolve([]);
    const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs);
    const componentFactory = this.resolver.resolveComponentFactory(AlertComponent);
    const componentRef = componentFactory.create(injector);
    const component = componentRef.instance;
    const componentRootNode = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.applicationRef.attachView(componentRef.hostView);
    componentRef.onDestroy(() => this.applicationRef.detachView(componentRef.hostView));

    document.body.appendChild(componentRootNode);
    options.icon = options.icon || 'alert';

    for (const s in options) {
      if (options[s]) {
        component[s] = options[s];
      }
    }

    if (options.full || options.full === undefined) {
      this.comp = this.modalService.open(component.template);
      return this.comp.result;
    }

    if (options.modal_address_error) {
      this.comp = this.modalService.open(component.template);
      setTimeout(() => {
        const backdrop = document.getElementsByClassName('modal-backdrop');
        if (backdrop.length > 0 && backdrop[1]) {
          backdrop[1].classList.add('modal-address-error-backdrop');
        }

        const content = document.getElementsByClassName('modal-content');
        if (content.length > 0 && content[1]) {
          content[1].classList.add('modal-small');
        }
      }, 0);
      return this.comp.result;
    }

    this.comp = this.modalService.open(component.template, { windowClass: 'full-overlay' });
    setTimeout(() => {
      const backdrop = document.getElementsByClassName('modal-backdrop');

      if (backdrop.length > 0 && backdrop[0].classList) {
        backdrop[0].classList.add('full-loading-backdrop');
      }

      const content = document.getElementsByClassName('modal-content');
      if (content.length > 0 && content[0].classList) {
        content[0].classList.add('bgFFF');
      }

      const modalWindow = document.getElementsByClassName('modal-window');
      if (modalWindow.length > 0 && modalWindow[0].classList) {
        modalWindow[0].classList.add('noBorder');
        modalWindow[0].classList.add('bgFFF');
      }

      const dialog = document.getElementsByClassName('modal-dialog');
      if (dialog.length > 0 && dialog[0].classList) {
        dialog[0].classList.add('rectangular');
      }
    }, 0);

    return this.comp.result;
  }

  showModal(ref) {
    return this.modalService.open(ref).result;
  }

  destroy() {
    this.comp.close();
  }
}
