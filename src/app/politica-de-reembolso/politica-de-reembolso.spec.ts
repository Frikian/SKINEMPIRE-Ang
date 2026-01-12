import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaDeReembolso } from './politica-de-reembolso';

describe('PoliticaDeReembolso', () => {
  let component: PoliticaDeReembolso;
  let fixture: ComponentFixture<PoliticaDeReembolso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticaDeReembolso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticaDeReembolso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
