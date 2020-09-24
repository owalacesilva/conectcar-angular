import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaqueComponent } from './plaque.component';

describe('PlaqueComponent', () => {
  let component: PlaqueComponent;
  let fixture: ComponentFixture<PlaqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
