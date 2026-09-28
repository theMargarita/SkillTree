using Infrastructure.Dtos.SkillBoard;
using Infrastructure.Dtos.SkillBoards;
using Microsoft.AspNetCore.Mvc;
using Services.IServices;

namespace SkillTree.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillBoardController : ControllerBase
    {
        private readonly ISkillBoardService _service;
        private readonly ILogger<SkillBoardController> _logger;

        public SkillBoardController(ISkillBoardService service, ILogger<SkillBoardController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet("user/{userId:guid}")]
        public async Task<ActionResult<List<SkillBoardResponse>>> GetAllForUser(Guid userId)
        {
            var boards = await _service.GetAllForUser(userId);
            return Ok(boards);
        }
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<SkillBoardDetailResponse>> GetBoardDetail(Guid id)
        {
            try
            {
                var detail = await _service.GetBoardDetail(id);
                return Ok(detail);
            }
            catch (KeyNotFoundException)
            {
                _logger.LogWarning($"Could nor find board: {id}");
                return NotFound();
            }
        }

        [HttpPost("user/{userId:guid}/create")]
        public async Task<ActionResult<SkillBoardResponse>> Create(Guid userId, [FromBody] SkillBoardRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _service.Create(userId, request);
            _logger.LogInformation($"Board created: {created.Id}");
            return CreatedAtAction(nameof(GetBoardDetail), new { id = created.Id }, created);
        }

        [HttpPatch("update/{id:guid}")]
        public async Task<ActionResult<SkillBoardResponse>> Update(Guid id, [FromBody] SkillBoardRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            try
            {
                var updated = await _service.Update(id, request);
                return Ok(updated);
            }
            catch (KeyNotFoundException)
            {
                _logger.LogWarning($"Could not find board: {id}");
                return NotFound();
            }
        }

        [HttpDelete("remove/{id:guid}")]
        public async Task<IActionResult>Delete(Guid id)
        {
            var deleted = await _service.Delete(id);
            if (!deleted)
            {
                return NotFound();
            }

            _logger.LogInformation($"Board deleted {id}");
            return NoContent();
        }
    }
}
