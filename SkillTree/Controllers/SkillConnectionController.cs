using Infrastructure.Dtos;
using Infrastructure.Dtos.SkillConnection;
using Microsoft.AspNetCore.Mvc;
using Services.IServices;

namespace SkillTree.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillConnectionController : ControllerBase
    {
        private readonly ISkillConnectionService _service;
        private readonly ILogger<SkillConnectionController> _logger;

        public SkillConnectionController(ISkillConnectionService service, ILogger<SkillConnectionController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpPost("create")]
        public async Task<ActionResult<SkillConnectionResponse>> Create([FromBody] SkillConnectionRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var created = await _service.Create(request);
                _logger.LogInformation($"Connection created: {created.Id}");
                return Ok(created);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex.Message);
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("remove/{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _service.Delete(id);
            if (!deleted)
            {
                return NotFound();
            }

            _logger.LogInformation($"Connection deleted: {id}");
            return NoContent();
        }
    }
}