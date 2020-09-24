import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RecursosService } from 'app/services/recursos.service';
import { FeatureToggleService } from 'app/services/featureToggle.service';
import * as localStore from 'store';

@Component({
  selector: 'adesao-confirmada-ponto-a-ponto',
  templateUrl: './adesao-confirmada-ponto-a-ponto.component.html',
  styleUrls: ['./adesao-confirmada-ponto-a-ponto.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AdesaoConfirmadaPontoAPontoComponent {
  constructor(
    private router: Router,
    private R: RecursosService,
    private ft: FeatureToggleService,
  ) {
    this.ft.Check('MeuConectCar', 'PontoAPonto');
  }

  goExtrato() {
    this.router.navigate(['meu-conect', 'extrato']);
  }
}
