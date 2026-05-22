import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  quantidadeMinima: number;
  unidade: string;
  emoji: string;
}

interface Movimentacao {
  id: string;
  nomeProduto: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  data: Date;
}

@Component({
  selector: 'app-controle-estoque',
  templateUrl: './controle-estoque.html',
  styleUrls: ['./controle-estoque.scss']
})
export class ControleEstoque implements OnInit {
  produtos: Produto[] = [
    { id: "1", nome: "Pão de Hamburguer", categoria: "Pães", quantidade: 15, quantidadeMinima: 30, unidade: "un", emoji: "🍔" },
    { id: "2", nome: "Carne Bovina", categoria: "Carnes", quantidade: 8, quantidadeMinima: 20, unidade: "kg", emoji: "🥩" },
    { id: "3", nome: "Queijo Cheddar", categoria: "Laticínios", quantidade: 12, quantidadeMinima: 15, unidade: "kg", emoji: "🧀" },
    { id: "4", nome: "Alface", categoria: "Vegetais", quantidade: 25, quantidadeMinima: 20, unidade: "un", emoji: "🥬" },
    { id: "5", nome: "Tomate", categoria: "Vegetais", quantidade: 30, quantidadeMinima: 25, unidade: "kg", emoji: "🍅" },
    { id: "6", nome: "Batata Congelada", categoria: "Congelados", quantidade: 5, quantidadeMinima: 15, unidade: "kg", emoji: "🍟" },
    { id: "7", nome: "Refrigerante", categoria: "Bebidas", quantidade: 40, quantidadeMinima: 30, unidade: "un", emoji: "🥤" },
  ];

  movimentacoes: Movimentacao[] = [
    { id: "1", nomeProduto: "Pão de Hamburguer", tipo: "saida", quantidade: 10, data: new Date(2026, 4, 20, 19, 30) },
    { id: "2", nomeProduto: "Carne Bovina", tipo: "entrada", quantidade: 20, data: new Date(2026, 4, 19, 14, 15) },
    { id: "3", nomeProduto: "Refrigerante", tipo: "saida", quantidade: 15, data: new Date(2026, 4, 18, 20, 0) },
  ];

  estoqueBaixo: Produto[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.estoqueBaixo = this.produtos.filter(p => p.quantidade < p.quantidadeMinima);
  }

  acessarRota(rota: string): void {
    this.router.navigate([rota]);
  }
}