using Infrastructure.Dtos.SKills;
using Microsoft.AspNetCore.Mvc;
using Services.IServices;
using Services.Services;

namespace SkillTree.Controllers
{
    [ApiController]
    [Route("[controller]")]
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
            var all = await _service.GetAllSkillsAsync();
            return Ok(all);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<SkillResponse>> GetById(Guid id)
        {
            var skillId = await _service.GetSkillTreeById(id);
            if (skillId == null)
            {
                _logger.LogWarning($"Warning: Could not fetch the given id, {id}");
                return NotFound();
            }
            return Ok(skillId);
        }

        [HttpPost("create")]
        public async Task<ActionResult<SkillResponse>> Create([FromBody] SkillRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Something went wrong with the creation of your skill"); // returns which fields failed and why, as JSON
            }

            var created = await _service.Create(request);
            if (created == null)
            {

                _logger.LogWarning($"Warning: Could not create the new skill: {request.Name}");

                return BadRequest("Could not created a skill");
            }

            _logger.LogInformation($"Information: Created {created}");
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> RemoveSkill(Guid id)
        {
            var delete = await _service.Delete(id);

            if (!delete)
            {
                return NotFound();
            }

            Console.WriteLine("It has now been deleted");
            _logger.LogInformation("Your skill has now been removed");
            //return Ok(delete);
            return NoContent();
        }

        [HttpPatch("update")]
        public async Task<ActionResult<SkillResponse>> Update(Guid id, SkillRequest request)
        {
            var skillId = await _service.Update(id, request);

            if(skillId == null)
            {
                _logger.LogWarning($"Could not find the skill id: {skillId}");
                return NotFound("Id not found");
            }

            _logger.LogInformation("Skill now updated");
            return Ok(skillId);
        }
    }
}
