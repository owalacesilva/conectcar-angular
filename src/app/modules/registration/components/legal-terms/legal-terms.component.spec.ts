import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalTermsComponent } from './address.component';

describe('LegalTermsComponent', () => {
  let component: LegalTermsComponent;
  let fixture: ComponentFixture<LegalTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
