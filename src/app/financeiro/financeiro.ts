import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  unidade: string;
  preco: number;
  estoque: number;
  emoji: string;
}

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./financeiro.scss']
})
export class Financeiro implements OnInit {
  private router = inject(Router);

  abaSelecionada: 'resumo' | 'vendas' | 'despesas' | 'produtos' = 'resumo';
  filtroSelecionado: 'hoje' | 'semana' | 'periodo' = 'hoje';

  busca: string = '';
  estoqueMinimo = 5;

  vendas = 178;
  despesas = 405;
  lucro = -227;

  resumo = {
    pedidos: 3,
    ticketMedio: 59.33,
    despesasRegistradas: 3,
    resultado: -227
  };

  produtos: Produto[] = [
    { id: 1, nome: 'Hot Dog', categoria: 'Lanches', unidade: 'unidade', preco: 15, estoque: 10, emoji: '🌭' },
    { id: 2, nome: 'Guaraná', categoria: 'Bebidas', unidade: 'unidade', preco: 7, estoque: 3, emoji: '🥤' },
    { id: 3, nome: 'Hambúrguer Clássico', categoria: 'Lanches', unidade: 'unidade', preco: 22, estoque: 8, emoji: '🍔' },
    { id: 4, nome: 'Coca-Cola', categoria: 'Bebidas', unidade: 'unidade', preco: 7, estoque: 6, emoji: '🥤' },
    { id: 5, nome: 'Batata Frita', categoria: 'Lanches', unidade: 'porção', preco: 12, estoque: 2, emoji: '🍟' }
  ];

  produtosFiltrados: Produto[] = [];

  ngOnInit() {
    this.produtosFiltrados = [...this.produtos];
  }

  selecionarAba(aba: any) {
    this.abaSelecionada = aba;
  }

  selecionarFiltro(filtro: any) {
    this.filtroSelecionado = filtro;
  }

  filtrarProdutos() {
    const termo = this.busca.toLowerCase().trim();
    
    if (!termo) {
      this.produtosFiltrados = [...this.produtos];
    } else {
      this.produtosFiltrados = this.produtos.filter(p =>
        p.nome.toLowerCase().includes(termo)
      );
    }
  }

  isEstoqueBaixo(p: Produto) {
    return p.estoque < this.estoqueMinimo;
  }

  novoProduto() {
    console.log('Novo produto');
  }

  editar(p: Produto) {
    console.log('Editar', p);
  }

  excluir(p: Produto) {
    if (confirm(`Excluir ${p.nome}?`)) {
      this.produtos = this.produtos.filter(x => x.id !== p.id);
      this.filtrarProdutos();
    }
  }
  protected acessarRota(rota: string) {
    this.router.navigate([rota]);
  }
}