import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ingrediente, IngredienteService } from '../cadastro-produto/ingrediente.service';
import { FichaTecnicaService, ItemFicha, Produto } from './ficha-tecnica.service';

type ItemForm = FormGroup<{
  ingredienteId: FormControl<number | null>;
  quantidade: FormControl<number | null>;
}>;

@Component({
  selector: 'app-ficha-tecnica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ficha-tecnica.html',
  styleUrl: './ficha-tecnica.scss',
})
export class FichaTecnica implements OnInit {
  ingredientes: Ingrediente[] = [];
  produtos: Produto[] = [];
  expandidos = new Set<number>();

  editandoId: number | null = null;
  erro: string | null = null;

  form = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: Validators.required }),
    precoVenda: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    itens: new FormArray<ItemForm>([]),
  });

  constructor(
    private ingredienteService: IngredienteService,
    private fichaTecnicaService: FichaTecnicaService,
  ) {}

  ngOnInit() {
    this.carregar();
    this.adicionarItem();
  }

  private carregar() {
    this.ingredientes = this.ingredienteService.listar();
    this.produtos = this.fichaTecnicaService.listar();
  }

  get itens(): FormArray<ItemForm> {
    return this.form.controls.itens;
  }

  private novoItem(item?: ItemFicha): ItemForm {
    return new FormGroup({
      ingredienteId: new FormControl<number | null>(item?.ingredienteId ?? null, Validators.required),
      quantidade: new FormControl<number | null>(item?.quantidade ?? null, [
        Validators.required,
        Validators.min(0.0001),
      ]),
    });
  }

  adicionarItem() {
    this.itens.push(this.novoItem());
  }

  removerItem(indice: number) {
    this.itens.removeAt(indice);
  }

  unidadeDoItem(indice: number): string {
    const id = this.itens.at(indice).controls.ingredienteId.value;
    return this.ingredientes.find((i) => i.id === id)?.unidade ?? '';
  }

  nomeIngrediente(id: number): string {
    return this.ingredientes.find((i) => i.id === id)?.nome ?? 'Ingrediente removido';
  }

  unidadeIngrediente(id: number): string {
    return this.ingredientes.find((i) => i.id === id)?.unidade ?? '';
  }

  private itensDoFormulario(): ItemFicha[] {
    return this.itens.controls
      .map((grupo) => grupo.getRawValue())
      .filter((i) => i.ingredienteId !== null && i.quantidade !== null && i.quantidade > 0)
      .map((i) => ({ ingredienteId: i.ingredienteId!, quantidade: i.quantidade! }));
  }

  /** Prévia de custo e margem enquanto o formulário é preenchido. */
  get previa() {
    return this.fichaTecnicaService.margem({
      precoVenda: this.form.controls.precoVenda.value ?? 0,
      itens: this.itensDoFormulario(),
    });
  }

  margemDe(produto: Produto) {
    return this.fichaTecnicaService.margem(produto);
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const nome = valores.nome.trim();
    const itens = this.itensDoFormulario();

    if (!nome) {
      this.form.controls.nome.setErrors({ required: true });
      this.form.markAllAsTouched();
      return;
    }

    if (itens.length === 0) {
      this.erro = 'Adicione pelo menos um ingrediente à ficha técnica.';
      return;
    }

    const repetido = itens.some((item, i) => itens.findIndex((o) => o.ingredienteId === item.ingredienteId) !== i);
    if (repetido) {
      this.erro = 'Há ingredientes repetidos na ficha. Use cada ingrediente uma única vez.';
      return;
    }

    if (this.fichaTecnicaService.nomeJaExiste(nome, this.editandoId ?? undefined)) {
      this.erro = `Já existe um produto chamado "${nome}".`;
      return;
    }

    const payload = { nome, precoVenda: valores.precoVenda!, itens };

    if (this.editandoId !== null) {
      this.fichaTecnicaService.atualizar(this.editandoId, payload);
    } else {
      this.fichaTecnicaService.criar(payload);
    }

    this.limparFormulario();
    this.carregar();
  }

  editar(produto: Produto) {
    this.erro = null;
    this.editandoId = produto.id;
    this.form.controls.nome.setValue(produto.nome);
    this.form.controls.precoVenda.setValue(produto.precoVenda);
    this.itens.clear();
    produto.itens.forEach((item) => this.itens.push(this.novoItem(item)));
    if (produto.itens.length === 0) {
      this.adicionarItem();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicao() {
    this.limparFormulario();
  }

  excluir(produto: Produto) {
    if (!confirm(`Excluir o produto "${produto.nome}" e sua ficha técnica?`)) {
      return;
    }

    this.fichaTecnicaService.excluir(produto.id);
    if (this.editandoId === produto.id) {
      this.limparFormulario();
    }
    this.carregar();
  }

  alternarExpansao(produto: Produto) {
    if (this.expandidos.has(produto.id)) {
      this.expandidos.delete(produto.id);
    } else {
      this.expandidos.add(produto.id);
    }
  }

  private limparFormulario() {
    this.editandoId = null;
    this.erro = null;
    this.form.controls.nome.reset('');
    this.form.controls.precoVenda.reset(null);
    this.itens.clear();
    this.adicionarItem();
  }
}
