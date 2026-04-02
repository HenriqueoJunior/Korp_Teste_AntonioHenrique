import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProduto } from './form-produto';

describe('FormProduto', () => {
  let component: FormProduto;
  let fixture: ComponentFixture<FormProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProduto],
    }).compileComponents();

    fixture = TestBed.createComponent(FormProduto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
