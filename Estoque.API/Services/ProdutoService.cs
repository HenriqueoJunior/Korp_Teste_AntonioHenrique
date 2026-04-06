using Estoque.API.Data;
using Estoque.API.DTOs;
using Estoque.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Estoque.API.Services
{
  public class ProdutoService : IProdutoService
  {
    private readonly AppDbContext _context;

    public ProdutoService(AppDbContext context)
    {
      _context = context;
    }

    public async Task<IEnumerable<Produto>> ListarAsync()
    {
      return await _context.Produtos.ToListAsync();
    }

    public async Task<Produto?> BuscarPorIdAsync(Guid id)
    {
      return await _context.Produtos.FindAsync(id);
    }

    public async Task<Produto> CriarAsync(CriarProdutoDTO dto)
    {
      var produto = new Produto
      {
        Codigo = dto.Codigo,
        Descricao = dto.Descricao,
        Saldo = dto.Saldo
      };

      _context.Produtos.Add(produto);
      await _context.SaveChangesAsync();
      return produto;
    }

    public async Task<Produto?> AtualizarAsync(Guid id, CriarProdutoDTO dto)
    {
      var produto = await _context.Produtos.FindAsync(id);
      if (produto is null) return null;

      produto.Codigo = dto.Codigo;
      produto.Descricao = dto.Descricao;
      produto.Saldo = dto.Saldo;

      await _context.SaveChangesAsync();
      return produto;
    }

    public async Task<bool> DeletarAsync(Guid id)
    {
      var produto = await _context.Produtos.FindAsync(id);
      if (produto is null) return false;

      _context.Produtos.Remove(produto);
      await _context.SaveChangesAsync();
      return true;
    }

    public async Task<bool> AtualizarSaldoAsync(IEnumerable<AtualizarSaldoDTO> itens)
    {
      foreach (var item in itens)
      {
        var produto = await _context.Produtos.FindAsync(item.ProdutoId);
        if (produto is null) return false;
        if (produto.Saldo < item.Quantidade) return false;

        produto.Saldo -= item.Quantidade;
      }

      await _context.SaveChangesAsync();
      return true;
    }
  }
}
