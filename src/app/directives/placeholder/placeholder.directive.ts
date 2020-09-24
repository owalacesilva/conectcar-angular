import { Directive, ElementRef, Input, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[cc-placeholder]',
})
export class PlaceholderDirective implements AfterViewInit {
    @Input('cc-placeholder') placeholder: string;
    private label: any;

    constructor(
      private el: ElementRef) {
    }

    onChange() {
      if (this.el.nativeElement.value) {
        this.activate();
      }
    }

    @HostListener('focus') onFocus() {
      this.activate();
    }

    @HostListener('blur') onBlur() {
      this.disable();
    }

    disable() {
      if (!this.el.nativeElement.value) {
        this.label.classList.remove('active');
      }
    }

    activate() {
      this.label.classList.add('active');
    }

    ngAfterViewInit() {
      const parent = this.el.nativeElement.parentNode;
      this.label = document.createElement('label');
      this.label.innerHTML = this.placeholder;
      this.label.classList.add('placeholder-label');
      this.label.classList.add('active');
      parent.insertBefore(this.label, this.el.nativeElement);
      this.el.nativeElement.setAttribute('placeholder', '');
      this.el.nativeElement.addEventListener('input', () => this.onChange());
      this.el.nativeElement.addEventListener('change', () => this.onChange());
      this.onChange();
    }
}
