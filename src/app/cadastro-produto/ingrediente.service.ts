import { Injectable } from '@angular/core';

export type UnidadeMedida = 'un' | 'g' | 'kg' | 'ml' | 'L';

export const UNIDADES: UnidadeMedida[] = ['un', 'g', 'kg', 'ml', 'L'];

export interface Ingrediente {
  id: number;
  nome: string;
  unidade: UnidadeMedida;
  /** Preço de custo por unidade de medida (ex.: R$ por kg). */
  custo: number;
  /** Quantidade em estoque, na unidade de medida do ingrediente. */
  estoque: number;
}

export type IngredientePayload = Omit<Ingrediente, 'id'>;

const CHAVE = 'easy-eats:ingredientes';

@Injectable({ providedIn: 'root' })
export class IngredienteService {
  listar(): Ingrediente[] {
    return this.ler().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  buscar(id: number): Ingrediente | undefined {
    return this.ler().find((i) => i.id === id);
  }

  criar(payload: IngredientePayload): Ingrediente {
    const lista = this.ler();
    const id = lista.reduce((maior, i) => Math.max(maior, i.id), 0) + 1;
    const novo: Ingrediente = { id, ...payload };
    this.gravar([...lista, novo]);
    return novo;
  }

  atualizar(id: number, payload: IngredientePayload): void {
    this.gravar(this.ler().map((i) => (i.id === id ? { id, ...payload } : i)));
  }

  excluir(id: number): void {
    this.gravar(this.ler().filter((i) => i.id !== id));
  }

  nomeJaExiste(nome: string, ignorarId?: number): boolean {
    const alvo = nome.trim().toLowerCase();
    return this.ler().some((i) => i.id !== ignorarId && i.nome.trim().toLowerCase() === alvo);
  }

  private ler(): Ingrediente[] {
    try {
      const bruto = localStorage.getItem(CHAVE);
      return bruto ? (JSON.parse(bruto) as Ingrediente[]) : [];
    } catch {
      return [];
    }
  }

  private gravar(lista: Ingrediente[]): void {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  }
}
