import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotaFiscalService } from '../../../services/nota-fiscal';
import { NotaFiscal } from '../../../models/nota-fiscal';

@Component({
  selector: 'app-lista-notas',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './lista-notas.html',
  styleUrl: './lista-notas.scss'
})
export class ListaNotas implements OnInit {
  notas: NotaFiscal[] = [];
  carregando = true;
  colunas = ['numero', 'status', 'itens', 'dataCriacao', 'acoes'];

  constructor(
    private notaFiscalService: NotaFiscalService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.notaFiscalService.listar().subscribe({
      next: (dados) => {
        this.notas = dados;
        this.carregando = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar notas fiscais. Verifique se o serviço está disponível.', 'Fechar', { duration: 4000 });
        this.carregando = false;
      }
    });
  }
}