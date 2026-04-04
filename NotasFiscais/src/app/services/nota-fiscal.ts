import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { NotaFiscal, CriarNotaDTO } from '../models/nota-fiscal';

@Injectable({
  providedIn: 'root'
})
export class NotaFiscalService {
  private apiUrl = 'http://localhost:5002/api/notas-fiscais';

  constructor(private http: HttpClient) {}

  listar(): Observable<NotaFiscal[]> {
    return this.http.get<NotaFiscal[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Erro ao listar notas fiscais:', err);
        return throwError(() => err);
      })
    );
  }

  buscarPorId(id: string): Observable<NotaFiscal> {
    return this.http.get<NotaFiscal>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Erro ao buscar nota fiscal:', err);
        return throwError(() => err);
      })
    );
  }

  buscarPorStatus(status: 'Aberta' | 'Fechada'): Observable<NotaFiscal[]> {
  return this.http.get<NotaFiscal[]>(`${this.apiUrl}/status/${status}`).pipe(
    catchError(err => {
      console.error('Erro ao buscar notas por status:', err);
      return throwError(() => err);
    })
  );
}

  criar(dto: CriarNotaDTO): Observable<NotaFiscal> {
    return this.http.post<NotaFiscal>(this.apiUrl, dto).pipe(
      catchError(err => {
        console.error('Erro ao criar nota fiscal:', err);
        return throwError(() => err);
      })
    );
  }

  imprimir(id: string): Observable<NotaFiscal> {
    return this.http.post<NotaFiscal>(`${this.apiUrl}/${id}/imprimir`, {}).pipe(
      catchError(err => {
        console.error('Erro ao imprimir nota fiscal:', err);
        return throwError(() => err);
      })
    );
  }
}