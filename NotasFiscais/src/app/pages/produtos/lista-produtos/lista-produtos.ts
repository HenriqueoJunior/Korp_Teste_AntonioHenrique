import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProdutoService } from '../../../services/produto';
import { Produto } from '../../../models/produto';

@Component({
  selector: 'app-lista-produtos',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './lista-produtos.html',
  styleUrl: './lista-produtos.scss'
})
export class ListaProdutos implements OnInit {
  produtos: Produto[] = [];
  carregando = true;
  colunas = ['codigo', 'descricao', 'saldo', 'acoes'];

  constructor(
    private produtoService: ProdutoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.produtoService.listar().subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.carregando = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar produtos. Verifique se o serviço está disponível.', 'Fechar', { duration: 4000 });
        this.carregando = false;
      }
    });
  }

  deletar(id: string): void {
    if (!confirm('Deseja realmente excluir este produto?')) return;

    this.produtoService.deletar(id).subscribe({
      next: () => {
        this.snackBar.open('Produto excluído com sucesso!', 'Fechar', { duration: 3000 });
        this.carregar();
      },
      error: () => {
        this.snackBar.open('Erro ao excluir produto.', 'Fechar', { duration: 3000 });
      }
    });
  }
}