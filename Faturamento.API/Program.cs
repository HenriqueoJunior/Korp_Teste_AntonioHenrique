using Faturamento.API.Data;
using Faturamento.API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
      options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
      options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=faturamento.db"));

builder.Services.AddHttpClient("EstoqueAPI", client =>
{
  client.BaseAddress = new Uri("http://localhost:5001/");
});

builder.Services.AddScoped<INotaFiscalService, NotaFiscalService>();

builder.Services.AddCors(options =>
{
  options.AddDefaultPolicy(policy =>
      policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
  db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
}

app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();
