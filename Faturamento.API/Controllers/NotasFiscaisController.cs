using Faturamento.API.DTOs;
using Faturamento.API.Models;
using Faturamento.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Faturamento.API.Controllers
{
  [ApiController]
  [Route("api/notas-fiscais")]
  public class NotasFiscaisController : ControllerBase
  {
    private readonly INotaFiscalService _service;

    public NotasFiscaisController(INotaFiscalService service)
    {
      _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
      var notas = await _service.ListarAsync();
      return Ok(notas);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> BuscarPorId(Guid id)
    {
      var nota = await _service.BuscarPorIdAsync(id);
      if (nota is null) return NotFound();
      return Ok(nota);
    }

    [HttpGet("status/{status}")]
    public async Task<IActionResult> BuscarPorStatus(StatusNota status)
    {
      var notas = await _service.BuscarPorStatusAsync(status);
      return Ok(notas);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarNotaDTO dto)
    {
      if (!ModelState.IsValid) return BadRequest(ModelState);

      var nota = await _service.CriarAsync(dto);
      return CreatedAtAction(nameof(BuscarPorId), new { id = nota.Id }, nota);
    }

    [HttpPost("{id:guid}/imprimir")]
    public async Task<IActionResult> Imprimir(Guid id)
    {
      var (nota, erro) = await _service.ImprimirAsync(id);

      if (erro is not null)
        return BadRequest(new { erro });

      return Ok(nota);
    }
  }
}
