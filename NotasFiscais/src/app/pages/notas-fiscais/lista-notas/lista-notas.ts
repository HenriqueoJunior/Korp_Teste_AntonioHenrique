import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NotaFiscalService } from '../../../services/nota-fiscal';
import { NotaFiscal } from '../../../models/nota-fiscal';
import { Subject, switchMap, startWith } from 'rxjs';

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
    MatSnackBarModule,
    MatButtonToggleModule
  ],
  templateUrl: './lista-notas.html',
  styleUrl: './lista-notas.scss'
})
export class ListaNotas implements OnInit {
  notas = signal<NotaFiscal[]>([]);
  carregando = signal(true);
  filtroAtual = signal<string>('todos');
  colunas = ['numero', 'status', 'itens', 'dataCriacao', 'acoes'];

  private filtro$ = new Subject<string>();

  constructor(
    private notaFiscalService: NotaFiscalService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.filtro$.pipe(
      startWith('todos'),
      switchMap(filtro => {
        this.carregando.set(true);
        if (filtro === 'Aberta') return this.notaFiscalService.buscarPorStatus('Aberta');
        if (filtro === 'Fechada') return this.notaFiscalService.buscarPorStatus('Fechada');
        return this.notaFiscalService.listar();
      })
    ).subscribe({
      next: (dados) => {
        this.notas.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.snackBar.open('Erro ao carregar notas fiscais.', 'Fechar', { duration: 4000 });
        this.carregando.set(false);
      }
    });
  }

  filtrar(valor: string): void {
    this.filtroAtual.set(valor);
    this.filtro$.next(valor);
  }
}