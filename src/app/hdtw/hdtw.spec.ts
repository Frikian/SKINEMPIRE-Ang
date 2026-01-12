import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hdtw } from './hdtw';

describe('Hdtw', () => {
  let component: Hdtw;
  let fixture: ComponentFixture<Hdtw>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hdtw]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hdtw);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
