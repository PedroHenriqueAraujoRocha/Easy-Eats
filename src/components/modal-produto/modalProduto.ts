import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-produto',
  templateUrl: './modal-produto.html',
  styleUrls: ['./modal-produto.scss']
})
export class ModalProdutoComponent {
  @Input() produto: any = null; 
  @Output() fechar = new EventEmitter<void>();
  @Output() adicionar = new EventEmitter<any>();

  fecharModal() {
    this.fechar.emit();
  }

  adicionarProduto() {
    this.adicionar.emit(this.produto);
    this.fecharModal();
  }
}