import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'produtos',
    pathMatch: 'full'
  },
  {
    path: 'produtos',
    loadComponent: () =>
      import('./pages/produtos/lista-produtos/lista-produtos').then(m => m.ListaProdutos)
  },
  {
    path: 'produtos/novo',
    loadComponent: () =>
      import('./pages/produtos/form-produto/form-produto').then(m => m.FormProduto)
  },
  {
    path: 'produtos/editar/:id',
    loadComponent: () =>
      import('./pages/produtos/form-produto/form-produto').then(m => m.FormProduto)
  },
  {
    path: 'notas-fiscais',
    loadComponent: () =>
      import('./pages/notas-fiscais/lista-notas/lista-notas').then(m => m.ListaNotas)
  },
  {
    path: 'notas-fiscais/nova',
    loadComponent: () =>
      import('./pages/notas-fiscais/form-nota/form-nota').then(m => m.FormNota)
  },
  {
    path: 'notas-fiscais/:id',
    loadComponent: () =>
      import('./pages/notas-fiscais/detalhe-nota/detalhe-nota').then(m => m.DetalheNota)
  },
  {
    path: '**',
    redirectTo: 'produtos'
  }
];