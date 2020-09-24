import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAxleComponent } from './modalAxle.component';

describe('ModalAxleComponent', () => {
  let component: ModalAxleComponent;
  let fixture: ComponentFixture<ModalAxleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAxleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAxleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
