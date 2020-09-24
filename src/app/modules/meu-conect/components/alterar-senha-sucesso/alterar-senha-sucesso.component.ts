import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RecursosService } from 'app/services/recursos.service';

@Component({
  selector: 'app-alterar-senha-sucesso',
  templateUrl: './alterar-senha-sucesso.component.html',
  styleUrls: ['./alterar-senha-sucesso.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AlterarSenhaSucessoComponent implements OnInit {
  constructor(private R: RecursosService) {}
  ngOnInit() {}
}
