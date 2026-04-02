namespace Estoque.API.DTOs
{
  public class CriarProdutoDTO
  {
    public string Codigo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public int Saldo { get; set; }
  }

  public class AtualizarSaldoDTO
  {
    public Guid ProdutoId { get; set; }
    public int Quantidade { get; set; }
  }
}
