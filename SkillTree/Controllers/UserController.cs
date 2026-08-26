using Infrastructure.Dtos.Users;
using Microsoft.AspNetCore.Mvc;
using Services.IServices;
using Services.Services;

namespace SkillTree.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;
        private readonly ILogger<UserService> _logger;

        public UserController(IUserService service, ILogger<UserService> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet("getall")]
        public async Task<ActionResult<UserResponse>> GetAll()
        {
            var all = await _service.GetAll();
            return Ok(all);
        }

        [HttpPost("create")]
        public async Task<ActionResult<UserResponse>> Create(UserRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Something went wrong with creating user");
            }

            var user = await _service.Create(request);
            if (user == null)
            {
                _logger.LogWarning("Something went wrong");
                return BadRequest("Could not create new user");
            }

            _logger.LogInformation($"Successfully created user: {user.Name}");
            return Ok(user);
        }

        [HttpDelete("remove")]
        public async Task<ActionResult<UserResponse>> Delete(Guid id)
        {
            var user = await _service.Delete(id);

            if (!user)
            {
                _logger.LogWarning($"Could not remove user with id: {id}");
                return NotFound();
            }

            _logger.LogInformation($"User {id} now deleted");
            return Ok(user);
        }

        [HttpPatch("update")]
        public async Task<ActionResult<UserResponse>> Update(Guid id, UserRequest request)
        {
            var user = await _service.Update(id, request);

            if(user == null)
            {
                _logger.LogWarning($"Could not find the user with the given id: {id}");
                return NotFound();
            }

            _logger.LogInformation("User now updated");
            return Ok(user);
        }
    }
}
