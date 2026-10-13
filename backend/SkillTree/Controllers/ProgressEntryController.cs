using Infrastructure.Dto;
using Infrastructure.Dtos.ProgressEntry;
using Microsoft.AspNetCore.Mvc;
using Services.IServices;

namespace SkillTree.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgressEntryController : ControllerBase
    {
        private readonly IProgressEntryService _service;
        private readonly ILogger<ProgressEntryController> _logger;

        public ProgressEntryController(IProgressEntryService service, ILogger<ProgressEntryController> logger)
        {
            _service = service;
            _logger = logger;
        }

        // GET api/progressentries/byskill/{subSkillId}
        [HttpGet("byskill/{subSkillId:guid}")]
        public async Task<ActionResult<List<ProgressEntryResponse>>> GetAllBySubSkill(Guid subSkillId)
        {
            var entries = await _service.GetAllBySubSkill(subSkillId);
            return Ok(entries);
        }

        // POST api/progressentries/create
        [HttpPost("create")]
        public async Task<ActionResult<ProgressEntryResponse>> Create([FromBody] ProgressEntryRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var created = await _service.Create(request);
                _logger.LogInformation($"Progress entry created: {created.Id}");
                return Ok(created);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex.Message);
                return NotFound(ex.Message);
            }
        }
    }
}
