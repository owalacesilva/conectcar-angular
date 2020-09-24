import {
  Component, ViewChild, TemplateRef, Injectable, ComponentFactoryResolver, ApplicationRef,
  ReflectiveInjector, EmbeddedViewRef, Type, Optional, Input
} from "@angular/core";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
    <ng-template #content>
      <cc-spinner size="50" color="#fff" stroke="2"></cc-spinner>
    </ng-template>
  `
})
export class LoadingComponent {
  @ViewChild('content') template: TemplateRef<string>;
}

@Injectable()
export class LoadingService {
  componentRef;
  comp;

  constructor(
    private resolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private modalService: NgbModal) {}

  show() {
    const resolvedInputs = ReflectiveInjector.resolve([]);
    const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs);
    const componentFactory = this.resolver.resolveComponentFactory(LoadingComponent);
    this.componentRef = componentFactory.create(injector);
    const component = this.componentRef.instance;
    const componentRootNode = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.applicationRef.attachView(this.componentRef.hostView);
    this.componentRef.onDestroy(() => this.applicationRef.detachView(this.componentRef.hostView));
    setTimeout(() => {
      document.body.appendChild(componentRootNode);
      this.comp = this.modalService.open(component.template, { windowClass: 'full-loading' });
      const backdrop = document.getElementsByClassName('modal-backdrop');
      if (backdrop.length > 0) {
        backdrop[0].classList.add('full-loading-backdrop');
      }
    }, 0);
  }

  destroy() {
    if (this.comp && this.comp.close) {
      this.comp.close();
    }
  }
}
