import { TestBed } from '@angular/core/testing';

import { CarritoServei } from './carrito-servei';

describe('CarritoServei', () => {
  let service: CarritoServei;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoServei);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
