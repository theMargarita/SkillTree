using Domain;
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
            var all = await _service.GetAllBySkill(skillId);
            return Ok(all);
        }

        [HttpGet("completed/{skillId:guid}")]
        public async Task<ActionResult<List<SubSkillResponse>>> GetCompleted(Guid skillId)
        {
            var completed = await _service.GetCompleted(skillId);
            return Ok(completed);
        }

        [HttpGet("withprogress/{subskillId:guid}")]
        public async Task<ActionResult<List<SubSkillResponse>>> GetWithProgress(Guid subskillId)
        {
            try
            {
                var result = await _service.GetWithProgress(subskillId);
                return Ok(result);
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _service.Create(request);
            _logger.LogInformation($"Created sub skill: {created.Id}");
            return Ok(created);
        }

        [HttpPatch("update/{subskillId:guid}")]
        public async Task<ActionResult<SubSkillResponse>> Update(Guid subskillId, [FromBody] SubSkillRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            try
            {
                var updated = await _service.Update(request, subskillId);
                return Ok(updated);
            }
            catch (KeyNotFoundException)
            {
                _logger.LogWarning($"Could not find sun skill with id: {subskillId}");
                return NotFound();
            }
        }

        [HttpDelete("remove/{subskillId:guid}")]
        public async Task<IActionResult> Delete(Guid subskillId)
        {
            try
            {
                await _service.Delete(subskillId);
                _logger.LogInformation($"Sub skill id is successfully removed: {subskillId}");
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                _logger.LogWarning($"Could not find sub skill with id: {subskillId}");
                return NotFound();
            }
        }

        [HttpPatch("complete/{subskillId:guid}")]
        public async Task<IActionResult>MarkAsComplete(Guid subskillId)
        {
            var success = await _service.MarkAsIncomplete(subskillId);
            return success ? NoContent() : NotFound();
        }

        [HttpPatch("incomplete/{subskillId:guid}")]
        public async Task<IActionResult> MarkAsInComplete(Guid subskillId)
        {
            var success = await _service.MarkAsIncomplete(subskillId);
            return success ? NoContent() : NotFound();
        }

    }
}
