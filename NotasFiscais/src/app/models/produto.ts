export interface Produto {
  id: string;
  codigo: string;
  descricao: string;
  saldo: number;
}

export interface CriarProdutoDTO {
  codigo: string;
  descricao: string;
  saldo: number;
}