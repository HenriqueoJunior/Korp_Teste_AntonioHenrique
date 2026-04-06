using Faturamento.API.Data;
using Faturamento.API.DTOs;
using Faturamento.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Faturamento.API.Services
{
  public class NotaFiscalService : INotaFiscalService
  {
    private readonly AppDbContext _context;
    private readonly HttpClient _httpClient;
    private readonly ILogger<NotaFiscalService> _logger;

    public NotaFiscalService(AppDbContext context, IHttpClientFactory httpClientFactory, ILogger<NotaFiscalService> logger)
    {
      _context = context;
      _httpClient = httpClientFactory.CreateClient("EstoqueAPI");
      _logger = logger;
    }

    public async Task<IEnumerable<NotaFiscal>> ListarAsync()
    {
      return await _context.NotasFiscais
          .Include(n => n.Itens)
          .OrderByDescending(n => n.Numero)
          .ToListAsync();
    }

    public async Task<NotaFiscal?> BuscarPorIdAsync(Guid id)
    {
      return await _context.NotasFiscais
          .Include(n => n.Itens)
          .FirstOrDefaultAsync(n => n.Id == id);
    }

    public async Task<IEnumerable<NotaFiscal>> BuscarPorStatusAsync(StatusNota status)
    {
      return await _context.NotasFiscais
          .Include(n => n.Itens)
          .Where(n => n.Status == status)
          .OrderByDescending(n => n.Numero)
          .ToListAsync();
    }

    public async Task<NotaFiscal> CriarAsync(CriarNotaDTO dto)
    {
      var ultimoNumero = await _context.NotasFiscais
          .MaxAsync(n => (int?)n.Numero) ?? 0;

      var itens = new List<ItemNota>();

      foreach (var itemDto in dto.Itens)
      {
        var response = await _httpClient.GetAsync($"api/produtos/{itemDto.ProdutoId}");

        if (!response.IsSuccessStatusCode)
          throw new Exception($"Produto {itemDto.ProdutoId} não encontrado no estoque.");

        var produto = await response.Content.ReadFromJsonAsync<JsonElement>();

        itens.Add(new ItemNota
        {
          ProdutoId = itemDto.ProdutoId,
          CodigoProduto = produto.GetProperty("codigo").GetString() ?? "",
          DescricaoProduto = produto.GetProperty("descricao").GetString() ?? "",
          Quantidade = itemDto.Quantidade
        });
      }

      var nota = new NotaFiscal
      {
        Numero = ultimoNumero + 1,
        Itens = itens
      };

      _context.NotasFiscais.Add(nota);
      await _context.SaveChangesAsync();
      return nota;
    }

    public async Task<(NotaFiscal? nota, string? erro)> ImprimirAsync(Guid id)
    {
      var nota = await _context.NotasFiscais
          .Include(n => n.Itens)
          .FirstOrDefaultAsync(n => n.Id == id);

      if (nota is null)
        return (null, "Nota fiscal não encontrada.");

      if (nota.Status != StatusNota.Aberta)
        return (null, "Apenas notas com status Aberta podem ser impressas.");

      var itensParaAtualizar = nota.Itens.Select(i => new AtualizarSaldoDTO
      {
        ProdutoId = i.ProdutoId,
        Quantidade = i.Quantidade
      }).ToList();

      try
      {
        var response = await _httpClient.PostAsJsonAsync("api/produtos/atualizar-saldo", itensParaAtualizar);

        if (!response.IsSuccessStatusCode)
        {
          var erro = await response.Content.ReadAsStringAsync();
          _logger.LogWarning("Falha ao atualizar saldo: {Erro}", erro);
          return (null, "Saldo insuficiente ou produto não encontrado no estoque.");
        }
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Erro ao comunicar com o serviço de estoque.");
        return (null, "Serviço de estoque indisponível. Tente novamente mais tarde.");
      }

      nota.Status = StatusNota.Fechada;
      await _context.SaveChangesAsync();
      return (nota, null);
    }
  }
}
