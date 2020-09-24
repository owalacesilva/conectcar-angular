import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RecursosService } from 'app/services/recursos.service';
import { FeatureToggleService } from 'app/services/featureToggle.service';
import { DialogService } from 'app/services/dialog.service';
import { RecargaService } from 'app/services/recarga.service';
import { ApiResponse } from 'app/models/api-response.model';

@Component({
  selector: 'aderir-ponto-a-ponto',
  templateUrl: './aderir-ponto-a-ponto.component.html',
  styleUrls: ['./aderir-ponto-a-ponto.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AderirPontoAPontoComponent {
  constructor(
    private router: Router,
    private R: RecursosService,
    private ft: FeatureToggleService,
  ) {
    this.ft.Check('MeuConectCar', 'PontoAPonto');
  }

  submit() {
    this.router.navigate(['ponto-a-ponto', 'confirmar-adesao']);
  }
}
