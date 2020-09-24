import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import * as store from 'store';

@Component({
  selector: 'cc-pedido-passos',
  templateUrl: './pedido-passos.component.html',
  styleUrls: ['./pedido-passos.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class PedidoPassosComponent implements OnInit {
  @Input() steps: Object[];

  private doneAt: number = null;

  constructor() { }

  ngOnInit() {
    if (!this.steps) {
      return;
    }
    this.steps[0]['done'] = true
    this.steps.forEach((step: any, i: number) => {
      if (step.done) {
        this.doneAt = i;
      }
    })

    if (this.doneAt) {
      this.steps.forEach((step: any, i: number) => {
        if (i <= this.doneAt) {
          step.done = true;
        }
      });
    }
  }
}
