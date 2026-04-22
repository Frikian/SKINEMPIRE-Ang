import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestureDetector } from './gesture-detector';

describe('GestureDetector', () => {
  let component: GestureDetector;
  let fixture: ComponentFixture<GestureDetector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestureDetector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestureDetector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
