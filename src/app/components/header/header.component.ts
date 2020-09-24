import { Component, Output, EventEmitter, Input, ViewEncapsulation, HostListener, AfterViewInit, Renderer, ViewChild } from '@angular/core';
import { RecursosService } from 'app/services/recursos.service';
import { Router } from '@angular/router';
import * as store from 'store';

@Component({
  selector: 'cc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements AfterViewInit {
  @Input('origin') origin     = 'home';
  @Input('restrict') restrict = false;
  @Input('minimal') minimal = false;

  @ViewChild('avatarEl') avatarEl;
  @ViewChild('avatarMobileEl') avatarMobileEl;
  @ViewChild('subMenuDrop') subMenuDrop;
  @ViewChild('headerMenuDrop') headerMenuDrop;

  @Output() avatar: string;

  private openedNavBar;
  private cliente;
  private subMenuTimeout;
  private searchInputVisible = false;

  private subItemPlanos       = true;
  private subItemServicos     = true;
  private subItemComoFunciona = true;
  private subItemEntrar       = true;
  private documentHeight: any;
  private query: any;
  public navIsFixed = false;

  constructor(
    private R: RecursosService,
    private renderer: Renderer,
    private router: Router,
  ) {
    this.openedNavBar = true;
    this.cliente      = store.get('cliente');
    this.avatar       = store.get('avatar');
  }

  get showRecarga() {
    return store.get('contaSelecionada');
  }

  changeAvatar(avatar: string) {
    if (!avatar || avatar === '') {
      return;
    }

    ['avatarEl', 'avatarMobileEl']
      .filter(el => !!this[el] && !!this[el].nativeElement)
      .map(el => this[el].nativeElement)
      .forEach(el => {
        el.style.backgroundImage = `url(${avatar})`;
        el.style.backgroundSize = 'cover';
      });
  }

  ngAfterViewInit() {
    this.documentHeight = document.documentElement.clientHeight;
    this.changeAvatar(this.avatar);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number > 100) {
      this.navIsFixed = true;
    } else if (this.navIsFixed && number < 10) {
      this.navIsFixed = false;
    }
  }

  onOpenedNavBar() {
    this.openedNavBar = !this.openedNavBar;
  }

  setHeight(el, height) {
    this.renderer.setElementStyle(el, 'height', height + 'px');
  }

  send() {
    window.location.href = 'http://conectcar.jurema.la/?page_id=452&query=' + this.query;
  }

  mouseEnterMenuDrop(event) {
    event.stopPropagation();
    clearTimeout(this.subMenuTimeout);

    this.subMenuDrop.open();
  }

  mouseLeaveMenuDrop(event) {
    this.subMenuTimeout = setTimeout(() => {
      event.stopPropagation();
      this.subMenuDrop.close();
    }, 1000);
  }

  /**
   * [mouseEnterHeaderMenuDrop description]
   *
   * @param {[type]} event [description]
   */
  mouseEnterHeaderMenuDrop(event) {
    event.stopPropagation();
    clearTimeout(this.subMenuTimeout);

    // this.headerMenuDrop.open();
  }

  /**
   * [mouseLeaveHeaderMenuDrop description]
   *
   * @param {[type]} event [description]
   */
  mouseLeaveHeaderMenuDrop(event) {
    this.subMenuTimeout = setTimeout(() => {
      event.stopPropagation();
      // this.headerMenuDrop.close();
    }, 1000);
  }
}
