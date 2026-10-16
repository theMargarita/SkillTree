using Infrastructure.Dtos.SKills;
using Microsoft.AspNetCore.Mvc;
using Services.IServices;

namespace SkillTree.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class SkillController : ControllerBase
    {
        private readonly ILogger<SkillController> _logger;
        private readonly ISkillService _service;

        public SkillController(ILogger<SkillController> logger, ISkillService service)
        {
            _logger = logger;
            _service = service;
        }

        [HttpGet("getAll")]
        public async Task<ActionResult<List<SkillResponse>>> GetAll()
        {
            return Ok(await _service.GetAllSkillsAsync());
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<SkillResponse>> GetById(Guid id)
        {
            try
            {
                return Ok(await _service.GetSkillTreeById(id));
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex.Message);
                return NotFound(ex.Message);
            }
        }

        [HttpPost("create")]
        public async Task<ActionResult<SkillResponse>> Create([FromBody] SkillRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var created = await _service.Create(request);
                _logger.LogInformation($"Information: Created {created}");
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (ArgumentException ex) { return BadRequest(ex.Message); }
            catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
        }

        [HttpDelete("remove/{id:guid}")]
        public async Task<IActionResult> RemoveSkill(Guid id)
        {
            var deleted = await _service.Delete(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpPatch("update/{id:guid}")]
        public async Task<ActionResult<SkillResponse>> Update(Guid id, [FromBody] SkillRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                return Ok(await _service.Update(id, request));
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex.Message);
                return NotFound(ex.Message);
            }
        }
    }
}