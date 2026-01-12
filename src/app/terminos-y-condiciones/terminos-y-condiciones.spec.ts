import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosYCondiciones } from './terminos-y-condiciones';

describe('TerminosYCondiciones', () => {
  let component: TerminosYCondiciones;
  let fixture: ComponentFixture<TerminosYCondiciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminosYCondiciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminosYCondiciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
