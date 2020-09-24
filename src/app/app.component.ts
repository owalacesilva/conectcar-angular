import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RecursosService } from 'app/services/recursos.service';
import { FeatureToggleService } from 'app/services/featureToggle.service';
import * as store from 'store';
import Fingerprint2 from 'fingerprintjs2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title: String = 'conectcar';
  isMobile: Boolean = false;
  images = []
  imageObj = <any>Object

  constructor(
    private recursos: RecursosService,
    private featureToggle: FeatureToggleService,
  ) {
    featureToggle.Load();
    recursos.Load();

    // per hour update
    setInterval(() => {
      featureToggle.Load();
      recursos.Load();
    }, 1000 * 60 * 60);

    // 5 minute update - skip if feature toggle exists
    const sec = setInterval(() => {
      const ft = !!store.get('featureToggle');

      if (!ft) {
        featureToggle.Load();
      }

      if (sec && ft) {
        clearInterval(sec);
      }
    }, 5 * 1000 * 60);

    new Fingerprint2()
      .get((result, components) =>
        store.set('fingerprint', result));
  }

  ngOnInit() {
    this.preloader();
    this.isMobile = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/
      .test(window.navigator.userAgent);
    if (this.isMobile) {
      window.document.body.classList.add('mobile');
    }
  }

  preloader() {
    this.imageObj = new Image();

    this.images = [
      'ic_seja_bem_vindo.png',
      'ic_aplicativo_integrado.png',
      'ic_caixa_foto.png',
      'ic_caminhonete.png',
      'ic_design_adesivo.png',
      'ic_login.png',
    ].map(img => `~assets/img/landing/${img}`);
    this.images.push('~assets/svg/ico_mini_check2.svg');

    this.images.forEach(img => { this.imageObj.src = img });
  }
}
