namespace Faturamento.API.Models
{
  public enum StatusNota
  {
    Aberta,
    Fechada
  }

  public class ItemNota
  {
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid NotaFiscalId { get; set; }
    public Guid ProdutoId { get; set; }
    public string CodigoProduto { get; set; } = string.Empty;
    public string DescricaoProduto { get; set; } = string.Empty;
    public int Quantidade { get; set; }
    public NotaFiscal NotaFiscal { get; set; } = null!;
  }

  public class NotaFiscal
  {
    public Guid Id { get; set; } = Guid.NewGuid();
    public int Numero { get; set; }
    public StatusNota Status { get; set; } = StatusNota.Aberta;
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public ICollection<ItemNota> Itens { get; set; } = new List<ItemNota>();
  }
}
