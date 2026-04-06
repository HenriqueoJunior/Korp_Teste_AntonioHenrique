using Estoque.API.DTOs;
using Estoque.API.Models;

namespace Estoque.API.Services
{
  public interface IProdutoService
  {
    Task<IEnumerable<Produto>> ListarAsync();
    Task<Produto?> BuscarPorIdAsync(Guid id);
    Task<Produto> CriarAsync(CriarProdutoDTO dto);
    Task<Produto?> AtualizarAsync(Guid id, CriarProdutoDTO dto);
    Task<bool> DeletarAsync(Guid id);
    Task<bool> AtualizarSaldoAsync(IEnumerable<AtualizarSaldoDTO> itens);
  }
}
