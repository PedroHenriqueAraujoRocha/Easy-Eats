import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-produto',
  templateUrl: './modal-produto.html',
  styleUrls: ['./modal-produto.scss']
})
export class ModalProdutoComponent {
  // Recebe o produto clicado lá da tela de pedidos
  @Input() produto: any = null; 

  // Emite eventos de volta para a tela de pedidos
  @Output() fechar = new EventEmitter<void>();
  @Output() adicionar = new EventEmitter<any>();

  fecharModal() {
    this.fechar.emit();
  }

  adicionarProduto() {
    this.adicionar.emit(this.produto);
    this.fecharModal(); // Fecha o modal após adicionar
  }
}