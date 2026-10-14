using Infrastructure.Dtos.SubSkill;
using Microsoft.AspNetCore.Mvc;
using Services.IServices;

namespace SkillTree.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubSkillController : ControllerBase
    {
        private readonly ISubSkillService _service;
        private readonly ILogger<SubSkillController> _logger;

        public SubSkillController(ISubSkillService service, ILogger<SubSkillController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet("byskill/{skillId:guid}")]
        public async Task<ActionResult<List<SubSkillResponse>>> GetAllBySkill(Guid skillId)
        {
            return Ok(await _service.GetAllBySkill(skillId));
        }

        [HttpGet("completed/{skillId:guid}")]
        public async Task<ActionResult<List<SubSkillResponse>>> GetCompleted(Guid skillId)
        {
            return Ok(await _service.GetCompleted(skillId));
        }

        [HttpGet("withprogress/{subskillId:guid}")]
        public async Task<ActionResult<List<SubSkillResponse>>> GetWithProgress(Guid subskillId)
        {
            try
            {
                return Ok(await _service.GetWithProgress(subskillId));
            }
            catch (KeyNotFoundException)
            {
                _logger.LogWarning($"Could not find sub skill with id: {subskillId}");
                return NotFound();
            }
        }

        [HttpPost("create")]
        public async Task<ActionResult<SubSkillResponse>> Create([FromBody] SubSkillRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var created = await _service.Create(request);
                return Ok(created);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPatch("update/{subskillId:guid}")]
        public async Task<ActionResult<SubSkillResponse>> Update(Guid subskillId, [FromBody] SubSkillRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                return Ok(await _service.Update(request, subskillId));
            }
            catch (KeyNotFoundException)
            {
                _logger.LogWarning($"Could not find sub skill with id: {subskillId}");
                return NotFound();
            }
        }

        [HttpDelete("remove/{subskillId:guid}")]
        public async Task<IActionResult> Delete(Guid subskillId)
        {
            try
            {
                await _service.Delete(subskillId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // One endpoint toggles complete <-> incomplete. Returns the updated subskill as JSON.
        [HttpPatch("toggle/{subskillId:guid}")]
        public async Task<ActionResult<SubSkillResponse>> Toggle(Guid subskillId)
        {
            try
            {
                return Ok(await _service.MarkAsComplete_Or_Incomplete(subskillId));
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}