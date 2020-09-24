import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[focus-watcher]',
})
export class FocusWatcherDirective {

    resetScroll() {
      [0, 100, 300, 500].forEach(t => setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      }, t));
    }

    @HostListener('focus') onFocus() {
      document.body.classList.add('inputActive');
      this.resetScroll();
    }

    @HostListener('blur', ['$event']) onBlur(evt) {
      if (!evt.currentTarget || (evt.relatedTarget &&
        (['INPUT', 'TEXTAREA'].indexOf(evt.relatedTarget.nodeName) >= 0 ||
        evt.relatedTarget.classList.contains('avancar') ||
        evt.relatedTarget.classList.contains('voltar')))) {
        evt.preventDefault();
        evt.stopPropagation();
        return false;
      }
      document.body.classList.remove('inputActive');
    }
}
