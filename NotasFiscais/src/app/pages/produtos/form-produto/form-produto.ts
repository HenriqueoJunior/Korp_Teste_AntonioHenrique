import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProdutoService } from '../../../services/produto';

@Component({
  selector: 'app-form-produto',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './form-produto.html',
  styleUrl: './form-produto.scss'
})
export class FormProduto implements OnInit {
  form: FormGroup;
  carregando = false;
  salvando = false;
  editando = false;
  produtoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      saldo: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.produtoId = this.route.snapshot.paramMap.get('id');
    this.editando = !!this.produtoId;

    if (this.editando && this.produtoId) {
      this.carregando = true;
      this.produtoService.buscarPorId(this.produtoId).subscribe({
        next: (produto) => {
          this.form.patchValue(produto);
          this.carregando = false;
        },
        error: () => {
          this.snackBar.open('Erro ao carregar produto.', 'Fechar', { duration: 3000 });
          this.router.navigate(['/produtos']);
        }
      });
    }
  }

  salvar(): void {
    if (this.form.invalid) return;

    this.salvando = true;
    const dto = this.form.value;

    const operacao = this.editando && this.produtoId
      ? this.produtoService.atualizar(this.produtoId, dto)
      : this.produtoService.criar(dto);

    operacao.subscribe({
      next: () => {
        this.snackBar.open(
          this.editando ? 'Produto atualizado!' : 'Produto criado!',
          'Fechar',
          { duration: 3000 }
        );
        this.router.navigate(['/produtos']);
      },
      error: () => {
        this.snackBar.open('Erro ao salvar produto.', 'Fechar', { duration: 3000 });
        this.salvando = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/produtos']);
  }
}