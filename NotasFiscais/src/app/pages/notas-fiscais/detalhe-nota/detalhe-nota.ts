import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotaFiscalService } from '../../../services/nota-fiscal';
import { NotaFiscal } from '../../../models/nota-fiscal';

@Component({
  selector: 'app-detalhe-nota',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './detalhe-nota.html',
  styleUrl: './detalhe-nota.scss'
})
export class DetalheNota implements OnInit {
  nota = signal<NotaFiscal | null>(null);
  carregando = signal(true);
  imprimindo = signal(false);
  colunas = ['codigo', 'descricao', 'quantidade'];

  constructor(
    private notaFiscalService: NotaFiscalService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/notas-fiscais']);
      return;
    }

    this.notaFiscalService.buscarPorId(id).subscribe({
      next: (nota) => {
        this.nota.set(nota);
        this.carregando.set(false);
      },
      error: () => {
        this.snackBar.open('Erro ao carregar nota fiscal.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/notas-fiscais']);
      }
    });
  }

  imprimir(): void {
    const nota = this.nota();
    if (!nota || nota.status !== 'Aberta') return;

    this.imprimindo.set(true);
    this.notaFiscalService.imprimir(nota.id).subscribe({
      next: (notaAtualizada) => {
        this.nota.set(notaAtualizada);
        this.imprimindo.set(false);
        this.snackBar.open('Nota fiscal impressa com sucesso!', 'Fechar', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Erro ao imprimir nota. Verifique se o serviço de estoque está disponível.', 'Fechar', { duration: 4000 });
        this.imprimindo.set(false);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/notas-fiscais']);
  }
}