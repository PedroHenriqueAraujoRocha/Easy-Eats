import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type TipoPedido = 'local' | 'levar';
type FormaPagamento = 'dinheiro' | 'pix' | 'credito' | 'debito';

@Component({
  selector: 'app-confirma-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirma-pedido.html',
  styleUrls: ['./confirma-pedido.scss'] // <-- aqui também corrigi: styleUrls, plural
})
export class ConfirmaPedidoComponent {

  tipoPedido = signal<TipoPedido>('local');
  formaPagamento = signal<FormaPagamento>('dinheiro');
  pagarDepois = signal<boolean>(false);

  formasPagamento = [
    { valor: 'dinheiro', label: 'Dinheiro', icone: 'bi-cash' },
    { valor: 'pix',      label: 'PIX',      icone: 'bi-qr-code' },
    { valor: 'credito',  label: 'Crédito',  icone: 'bi-credit-card' },
    { valor: 'debito',   label: 'Débito',   icone: 'bi-bank' },
  ];

  selecionarTipo(tipo: TipoPedido): void {
    this.tipoPedido.set(tipo);
  }

  selecionarPagamento(forma: string): void {
  const formasValidas: FormaPagamento[] = ['dinheiro', 'pix', 'credito', 'debito'];
  if (formasValidas.includes(forma as FormaPagamento)) {
    this.formaPagamento.set(forma as FormaPagamento);
  }
}

  togglePagarDepois(): void {
    this.pagarDepois.set(!this.pagarDepois());
  }

  enviarPedido(): void {
    console.log('Pedido enviado!', {
      tipo: this.tipoPedido(),
      pagamento: this.formaPagamento(),
      pagarDepois: this.pagarDepois()
    });
  }
}