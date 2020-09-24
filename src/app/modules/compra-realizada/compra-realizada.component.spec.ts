import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraRealizadaComponent } from './compra-realizada.component';

describe('CompraRealizadaComponent', () => {
  let component: CompraRealizadaComponent;
  let fixture: ComponentFixture<CompraRealizadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompraRealizadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraRealizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
