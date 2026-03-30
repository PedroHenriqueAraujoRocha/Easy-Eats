import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmaPedidoComponent } from './confirma-pedido';

describe('ConfirmaPedido', () => {
  let component: ConfirmaPedidoComponent;
  let fixture: ComponentFixture<ConfirmaPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmaPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmaPedidoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
