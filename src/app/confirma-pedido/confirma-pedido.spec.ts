import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmaPedido } from './confirma-pedido';

describe('ConfirmaPedido', () => {
  let component: ConfirmaPedido;
  let fixture: ComponentFixture<ConfirmaPedido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmaPedido]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmaPedido);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
