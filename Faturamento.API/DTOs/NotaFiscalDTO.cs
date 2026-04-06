namespace Faturamento.API.DTOs
{
  public class ItemNotaDTO
  {
    public Guid ProdutoId { get; set; }
    public int Quantidade { get; set; }
  }

  public class CriarNotaDTO
  {
    public List<ItemNotaDTO> Itens { get; set; } = new();
  }

  public class AtualizarSaldoDTO
  {
    public Guid ProdutoId { get; set; }
    public int Quantidade { get; set; }
  }
}
