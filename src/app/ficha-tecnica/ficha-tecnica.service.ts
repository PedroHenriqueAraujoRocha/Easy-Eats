import { Injectable } from '@angular/core';
import { IngredienteService } from '../cadastro-produto/ingrediente.service';

export interface ItemFicha {
  ingredienteId: number;
  /** Quantidade usada, na unidade de medida do ingrediente. */
  quantidade: number;
}

export interface Produto {
  id: number;
  nome: string;
  precoVenda: number;
  ativo: boolean;
  /** Quantidade de produtos prontos em estoque. */
  estoque: number;
  itens: ItemFicha[];
}

export interface ProdutoPayload {
  nome: string;
  precoVenda: number;
  itens: ItemFicha[];
}

export interface Margem {
  custo: number;
  lucro: number;
  /** Percentual sobre o preço de venda; null quando o preço é zero. */
  percentual: number | null;
}

const CHAVE = 'easy-eats:produtos';

@Injectable({ providedIn: 'root' })
export class FichaTecnicaService {
  constructor(private ingredienteService: IngredienteService) {}

  listar(): Produto[] {
    return this.ler().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  criar(payload: ProdutoPayload): Produto {
    const lista = this.ler();
    const id = lista.reduce((maior, p) => Math.max(maior, p.id), 0) + 1;
    const novo: Produto = { id, ativo: true, estoque: 0, ...payload };
    this.gravar([...lista, novo]);
    return novo;
  }

  /** Atualiza nome, preço e composição, preservando estoque e status. */
  atualizar(id: number, payload: ProdutoPayload): void {
    this.gravar(this.ler().map((p) => (p.id === id ? { ...p, ...payload } : p)));
  }

  atualizarEstoque(id: number, estoque: number): void {
    this.gravar(this.ler().map((p) => (p.id === id ? { ...p, estoque } : p)));
  }

  definirAtivo(id: number, ativo: boolean): void {
    this.gravar(this.ler().map((p) => (p.id === id ? { ...p, ativo } : p)));
  }

  excluir(id: number): void {
    this.gravar(this.ler().filter((p) => p.id !== id));
  }

  nomeJaExiste(nome: string, ignorarId?: number): boolean {
    const alvo = nome.trim().toLowerCase();
    return this.ler().some((p) => p.id !== ignorarId && p.nome.trim().toLowerCase() === alvo);
  }

  usaIngrediente(ingredienteId: number): boolean {
    return this.ler().some((p) => p.itens.some((i) => i.ingredienteId === ingredienteId));
  }

  custoDosItens(itens: ItemFicha[]): number {
    return itens.reduce((soma, item) => {
      const ingrediente = this.ingredienteService.buscar(item.ingredienteId);
      return soma + (ingrediente ? ingrediente.custo * item.quantidade : 0);
    }, 0);
  }

  margem(produto: Pick<Produto, 'precoVenda' | 'itens'>): Margem {
    const custo = this.custoDosItens(produto.itens);
    const lucro = produto.precoVenda - custo;
    const percentual = produto.precoVenda > 0 ? (lucro / produto.precoVenda) * 100 : null;
    return { custo, lucro, percentual };
  }

  private ler(): Produto[] {
    try {
      const bruto = localStorage.getItem(CHAVE);
      return bruto ? (JSON.parse(bruto) as Produto[]) : [];
    } catch {
      return [];
    }
  }

  private gravar(lista: Produto[]): void {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  }
}