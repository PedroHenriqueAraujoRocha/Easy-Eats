import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from '../../components/toggle-switch/toggle-switch';
import { FichaTecnicaService, Margem, Produto } from '../ficha-tecnica/ficha-tecnica.service';


@Component({
  selector: 'app-controle-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule, ToggleSwitchComponent],
  templateUrl: './controle-estoque.html',
  styleUrls: ['./controle-estoque.scss'],
})
export class ControleEstoque implements OnInit {
  produtos: Produto[] = [];
  editandoId: number | null = null;
  estoqueEditado: number | null = null;
  erro: string | null = null;

  constructor(private fichaTecnicaService: FichaTecnicaService) {}

  ngOnInit() {
    this.carregar();
  }

  private carregar() {
    this.produtos = this.fichaTecnicaService.listar();
  }

  get totalProdutos(): number {
    return this.produtos.length;
  }

  get totalAtivos(): number {
    return this.produtos.filter((p) => p.ativo).length;
  }

  get totalInativos(): number {
    return this.produtos.filter((p) => !p.ativo).length;
  }

  margemDe(produto: Produto): Margem {
    return this.fichaTecnicaService.margem(produto);
  }

  /** Classe do selo de margem: verde (>= 30%), laranja (10–30%), vermelho (< 10%). */
  classeMargem(produto: Produto): string {
    const { percentual } = this.margemDe(produto);
    if (percentual === null) return 'neutro';
    if (percentual >= 30) return 'sucesso';
    if (percentual >= 10) return 'alerta-fundo';
    return 'erro';
  }

  alternarAtivo(produto: Produto, ativo: boolean) {
    this.fichaTecnicaService.definirAtivo(produto.id, ativo);
    this.carregar();
  }

  editarEstoque(produto: Produto) {
    this.erro = null;
    this.editandoId = produto.id;
    this.estoqueEditado = produto.estoque;
  }

  cancelarEdicao() {
    this.editandoId = null;
    this.estoqueEditado = null;
    this.erro = null;
  }

  salvarEstoque(produto: Produto) {
    if (this.estoqueEditado === null || this.estoqueEditado < 0 || !Number.isFinite(this.estoqueEditado)) {
      this.erro = 'Informe uma quantidade em estoque maior ou igual a zero.';
      return;
    }

    this.fichaTecnicaService.atualizarEstoque(produto.id, this.estoqueEditado);
    this.cancelarEdicao();
    this.carregar();
  }

  remover(produto: Produto) {
    if (
      !confirm(
        `Remover o produto "${produto.nome}"? A ficha técnica dele também será excluída.`,
      )
    ) {
      return;
    }

    this.fichaTecnicaService.excluir(produto.id);
    if (this.editandoId === produto.id) {
      this.cancelarEdicao();
    }
    this.carregar();
  }
}
