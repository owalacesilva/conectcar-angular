import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RecursosService } from 'app/services/recursos.service';
import { FeatureToggleService } from 'app/services/featureToggle.service';

@Component({
  selector: 'cancelar-ponto-a-ponto',
  templateUrl: './cancelar-ponto-a-ponto.component.html',
  styleUrls: ['./cancelar-ponto-a-ponto.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class CancelarPontoAPontoComponent {
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
