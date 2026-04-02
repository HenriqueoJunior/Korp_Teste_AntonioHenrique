import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotaFiscalService } from '../../../services/nota-fiscal';
import { ProdutoService } from '../../../services/produto';
import { Produto } from '../../../models/produto';

@Component({
  selector: 'app-form-nota',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './form-nota.html',
  styleUrl: './form-nota.scss'
})
export class FormNota implements OnInit {
  form: FormGroup;
  produtos: Produto[] = [];
  carregando = true;
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private notaFiscalService: NotaFiscalService,
    private produtoService: ProdutoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      itens: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.carregando = false;
        this.adicionarItem();
      },
      error: () => {
        this.snackBar.open('Erro ao carregar produtos. Verifique se o serviço de estoque está disponível.', 'Fechar', { duration: 4000 });
        this.carregando = false;
      }
    });
  }

  get itens(): FormArray {
    return this.form.get('itens') as FormArray;
  }

  adicionarItem(): void {
    const item = this.fb.group({
      produtoId: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]]
    });
    this.itens.push(item);
  }

  removerItem(index: number): void {
    this.itens.removeAt(index);
  }

  salvar(): void {
    if (this.form.invalid || this.itens.length === 0) return;

    this.salvando = true;
    const dto = this.form.value;

    this.notaFiscalService.criar(dto).subscribe({
      next: (nota) => {
        this.snackBar.open('Nota fiscal criada com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/notas-fiscais', nota.id]);
      },
      error: () => {
        this.snackBar.open('Erro ao criar nota fiscal.', 'Fechar', { duration: 3000 });
        this.salvando = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/notas-fiscais']);
  }

  nomeProduto(id: string): string {
    return this.produtos.find(p => p.id === id)?.descricao ?? '';
  }
}