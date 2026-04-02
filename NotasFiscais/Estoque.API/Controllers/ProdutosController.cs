using Estoque.API.DTOs;
using Estoque.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Estoque.API.Controllers
{
  [ApiController]
  [Route("api/produtos")]
  public class ProdutosController : ControllerBase
  {
    private readonly IProdutoService _service;

    public ProdutosController(IProdutoService service)
    {
      _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
      var produtos = await _service.ListarAsync();
      return Ok(produtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> BuscarPorId(Guid id)
    {
      var produto = await _service.BuscarPorIdAsync(id);
      if (produto is null) return NotFound();
      return Ok(produto);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarProdutoDTO dto)
    {
      if (!ModelState.IsValid) return BadRequest(ModelState);

      var produto = await _service.CriarAsync(dto);
      return CreatedAtAction(nameof(BuscarPorId), new { id = produto.Id }, produto);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] CriarProdutoDTO dto)
    {
      if (!ModelState.IsValid) return BadRequest(ModelState);

      var produto = await _service.AtualizarAsync(id, dto);
      if (produto is null) return NotFound();
      return Ok(produto);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Deletar(Guid id)
    {
      var sucesso = await _service.DeletarAsync(id);
      if (!sucesso) return NotFound();
      return NoContent();
    }

    [HttpPost("atualizar-saldo")]
    public async Task<IActionResult> AtualizarSaldo([FromBody] IEnumerable<AtualizarSaldoDTO> itens)
    {
      var sucesso = await _service.AtualizarSaldoAsync(itens);
      if (!sucesso)
        return BadRequest(new { erro = "Saldo insuficiente ou produto não encontrado." });

      return Ok();
    }
  }
}
