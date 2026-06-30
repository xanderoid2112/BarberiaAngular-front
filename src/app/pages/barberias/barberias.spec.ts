import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Barberias } from './barberias';

describe('Barberias', () => {
  let component: Barberias;
  let fixture: ComponentFixture<Barberias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Barberias],
    }).compileComponents();

    fixture = TestBed.createComponent(Barberias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
