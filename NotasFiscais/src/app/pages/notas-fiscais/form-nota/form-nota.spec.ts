import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNota } from './form-nota';

describe('FormNota', () => {
  let component: FormNota;
  let fixture: ComponentFixture<FormNota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormNota],
    }).compileComponents();

    fixture = TestBed.createComponent(FormNota);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
