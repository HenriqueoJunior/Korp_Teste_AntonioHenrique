using Faturamento.API.DTOs;
using Faturamento.API.Models;

namespace Faturamento.API.Services
{
  public interface INotaFiscalService
  {
    Task<IEnumerable<NotaFiscal>> ListarAsync();
    Task<NotaFiscal?> BuscarPorIdAsync(Guid id);
    Task<NotaFiscal> CriarAsync(CriarNotaDTO dto);
    Task<(NotaFiscal? nota, string? erro)> ImprimirAsync(Guid id);
  }
}
