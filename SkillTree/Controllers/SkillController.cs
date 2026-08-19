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

        [HttpGet("getById")]
        public Task<IActionResult> GetById (Guid id)
        {

        }

        [HttpPost("create")]
        public async Task<ActionResult<SkillResponse>> Create([FromBody] SkillRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(); // returns which fields failed and why, as JSON
            }

            var created = await _service.Create(request);
            if(created == null)
            {
                return BadRequest("Could not created a skill");
            }

            return CreatedAtAction(nameof(GetById), new { id = created.Id}, created);
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
