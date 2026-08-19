using Infrastructure.Dtos.SKills;
using Microsoft.AspNetCore.Mvc;
using Services.IServices;
using Services.Services;

namespace SkillTree.Controllers
{
    [ApiController]
    [Route("controller")]
    public class SkillController : ControllerBase
    {
        private readonly string[] summarries =
        {

        };

        private readonly ILogger<SkillController> _logger;
        private readonly ISkillService _service;

        public SkillController(string[] summarries, ILogger<SkillController> logger, ISkillService service)
        {
            this.summarries = summarries;
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
                _logger.LogDebug($"Debug: Could not fetch the given id, {id} (this part is logdebug)");
                _logger.LogInformation($"Information: Could not fetch the given is: {id}");
                return NotFound();
            }
            return Ok(skillId);
        }

        [HttpPost("create")]
        public async Task<ActionResult<SkillResponse>> Create([FromBody] SkillRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(); // returns which fields failed and why, as JSON
            }

            var created = await _service.Create(request);
            if (created == null)
            {

                _logger.LogInformation($"Information: Could not create the new skill: {request.Name} (This part is loginformation)");
                _logger.LogDebug($"Debug: Could not create a skill");

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
            //return Ok(delete);
            return NoContent();
        }
    }
}
