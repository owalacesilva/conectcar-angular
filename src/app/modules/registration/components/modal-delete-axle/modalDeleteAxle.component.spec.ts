import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteAxleComponent } from './modalDeleteAxle.component';

describe('ModalAxleComponent', () => {
  let component: ModalDeleteAxleComponent;
  let fixture: ComponentFixture<ModalDeleteAxleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeleteAxleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteAxleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
