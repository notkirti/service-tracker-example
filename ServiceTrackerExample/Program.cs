using Microsoft.EntityFrameworkCore;
using ServiceTrackerExample.DataServices;
using ServiceTrackerExample.Interfaces;
using ServiceTrackerExample.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
           .AddInterceptors(new AuditInterceptor())); // Don't forget the Audit Log!

builder.Services.AddScoped<IJobRepository, JobRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Your Frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Swagger is optional but good to have if you want it back later
}

app.UseHttpsRedirection();

// 5. === USE CORS (Must be before MapControllers) ===
app.UseCors("AllowReactApp");

app.MapControllers();

app.Run();