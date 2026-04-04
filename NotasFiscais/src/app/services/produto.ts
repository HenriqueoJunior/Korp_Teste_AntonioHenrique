import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Produto, CriarProdutoDTO } from '../models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:5001/api/produtos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Erro ao listar produtos:', err);
        return throwError(() => err);
      })
    );
  }

  buscarPorId(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Erro ao buscar produto:', err);
        return throwError(() => err);
      })
    );
  }

  criar(dto: CriarProdutoDTO): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, dto).pipe(
      catchError(err => {
        console.error('Erro ao criar produto:', err);
        return throwError(() => err);
      })
    );
  }

  atualizar(id: string, dto: CriarProdutoDTO): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(err => {
        console.error('Erro ao atualizar produto:', err);
        return throwError(() => err);
      })
    );
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Erro ao deletar produto:', err);
        return throwError(() => err);
      })
    );
  }
}