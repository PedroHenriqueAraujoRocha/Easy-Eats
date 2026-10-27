import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FichaTecnicaService } from '../ficha-tecnica/ficha-tecnica.service';
import { Ingrediente, IngredienteService, UNIDADES, UnidadeMedida } from './ingrediente.service';

@Component({
  selector: 'app-cadastro-produto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastroProduto.html',
  styleUrls: ['./cadastroProduto.scss'],
})
export class CadastroProdutoComponent implements OnInit {
  unidades = UNIDADES;
  ingredientes: Ingrediente[] = [];

  editandoId: number | null = null;
  erro: string | null = null;

  form = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: Validators.required }),
    unidade: new FormControl<UnidadeMedida | null>(null, Validators.required),
    custo: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    estoque: new FormControl<number | null>(0, [Validators.required, Validators.min(0)]),
  });

  constructor(
    private ingredienteService: IngredienteService,
    private fichaTecnicaService: FichaTecnicaService,
  ) {}

  ngOnInit() {
    this.carregar();
  }

  private carregar() {
    this.ingredientes = this.ingredienteService.listar();
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const nome = valores.nome.trim();

    if (!nome) {
      this.form.controls.nome.setErrors({ required: true });
      this.form.markAllAsTouched();
      return;
    }

    if (this.ingredienteService.nomeJaExiste(nome, this.editandoId ?? undefined)) {
      this.erro = `Já existe um ingrediente chamado "${nome}".`;
      return;
    }

    const payload = {
      nome,
      unidade: valores.unidade!,
      custo: valores.custo!,
      estoque: valores.estoque!,
    };

    if (this.editandoId !== null) {
      this.ingredienteService.atualizar(this.editandoId, payload);
    } else {
      this.ingredienteService.criar(payload);
    }

    this.limparFormulario();
    this.carregar();
  }

  editar(ingrediente: Ingrediente) {
    this.erro = null;
    this.editandoId = ingrediente.id;
    this.form.setValue({
      nome: ingrediente.nome,
      unidade: ingrediente.unidade,
      custo: ingrediente.custo,
      estoque: ingrediente.estoque,
    });
  }

  cancelarEdicao() {
    this.limparFormulario();
  }

  excluir(ingrediente: Ingrediente) {
    if (this.fichaTecnicaService.usaIngrediente(ingrediente.id)) {
      this.erro = `"${ingrediente.nome}" está em uso na ficha técnica. Remova-o dos produtos antes de excluir.`;
      return;
    }

    if (!confirm(`Excluir o ingrediente "${ingrediente.nome}"?`)) {
      return;
    }

    this.ingredienteService.excluir(ingrediente.id);
    if (this.editandoId === ingrediente.id) {
      this.limparFormulario();
    }
    this.carregar();
  }

  private limparFormulario() {
    this.editandoId = null;
    this.erro = null;
    this.form.reset({ nome: '', unidade: null, custo: null, estoque: 0 });
  }
}
