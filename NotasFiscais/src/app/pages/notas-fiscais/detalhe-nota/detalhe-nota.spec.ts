import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheNota } from './detalhe-nota';

describe('DetalheNota', () => {
  let component: DetalheNota;
  let fixture: ComponentFixture<DetalheNota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheNota],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheNota);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
