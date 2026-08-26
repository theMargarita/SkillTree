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

            _logger.LogInformation("Successfully created user", user.Name);
            return Ok(user);
        }
    }
}
