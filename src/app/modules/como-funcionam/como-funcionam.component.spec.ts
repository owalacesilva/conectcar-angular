import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComoFuncionamComponent } from './como-funcionam.component';

describe('ComoFuncionamComponent', () => {
  let component: ComoFuncionamComponent;
  let fixture: ComponentFixture<ComoFuncionamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComoFuncionamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComoFuncionamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
