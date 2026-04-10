import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-produto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastroProduto.html',
  styleUrls: ['./cadastroProduto.scss'],
})
export class CadastroProdutoComponent {
  private router = inject(Router);
  currentYear = new Date().getFullYear();

  protected acessarRota(rota: string) {
    this.router.navigate([rota]);
  }

  form = new FormGroup({
    nome: new FormControl('', Validators.required),
    categoria: new FormControl('', Validators.required),
    preco: new FormControl('', Validators.required),
    estoque: new FormControl('', Validators.required),
  });

  salvar() {
    if (this.form.valid) {
      console.log('Dados do produto:', this.form.value);
      alert('Produto salvo com sucesso!');
    } else {
      alert('Preencha todos os campos corretamente!');
    }
  }
}
