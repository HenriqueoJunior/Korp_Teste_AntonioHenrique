export interface ItemNota {
  produtoId: string;
  codigoProduto: string;
  descricaoProduto: string;
  quantidade: number;
}

export interface NotaFiscal {
  id: string;
  numero: number;
  status: 'Aberta' | 'Fechada';
  itens: ItemNota[];
  dataCriacao: string;
}

export interface CriarNotaDTO {
  itens: { produtoId: string; quantidade: number; }[];
}