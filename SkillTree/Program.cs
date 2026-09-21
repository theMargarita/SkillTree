using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Services.IServices;
using Services.Services;


namespace SkillTree
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddScoped<ISkillService, SkillService>();
            builder.Services.AddScoped<IUserService,  UserService>();
            builder.Services.AddScoped<ISubSkillService, SubSkillService>();

            // Controllers
            builder.Services.AddControllers();
            

            // Swagger / OpenAPI
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //database
            builder.Services.AddDbContext<SkillDbContext>(opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<ISkillTreeDbContext>(sp =>
                sp.GetRequiredService<SkillDbContext>());

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddOpenApi();

            builder.Services.AddCors(opt =>
            {
                opt.AddPolicy("AllowAll", p =>
                {
                    p.WithOrigins("localhost")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            });


            var app = builder.Build();

            //app.UseDefaultFiles(); // Serve index.html by default
            //app.UseStaticFiles(); // Serve static files from wwwroot

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                //app.MapOpenApi();
                //app.MapScalarApiReference(); // browsable UI at /scalar/v1

                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
