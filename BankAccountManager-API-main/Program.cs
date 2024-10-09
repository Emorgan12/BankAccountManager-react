using System;
using System.Linq;
using System.Net.Mime;
using System.Text.Json;
using BankAccountManager;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using BankAccountManager_API_main.Data;
using Microsoft.EntityFrameworkCore;


public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {

        services.AddControllers(options =>
        {
            options.SuppressAsyncSuffixInActionNames = false;
        });
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "BankAccountManager-API", Version = "v1" });
        });

        services.AddHealthChecks();

        services.AddDbContext<DataContext>(options =>
     options.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));

        // Register IAccountsRepository implementation with the dependency injection container
        services.AddScoped<IAccountsRepository, AccountsRepository>();

    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {

        var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "BankAccountManager-API v1"); });
        }

        if (env.IsDevelopment())
        {
            app.UseHttpsRedirection();
        }

        app.UseCors(options =>
       {
           options.AllowAnyOrigin();
           options.AllowAnyHeader();
           options.AllowAnyMethod();
       });

        app.UseRouting();

        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();

            endpoints.MapHealthChecks("/health/ready", new HealthCheckOptions
            {
                Predicate = (check) => check.Tags.Contains("ready"),
                ResponseWriter = async (context, report) =>
                {
                    var result = JsonSerializer.Serialize(
                        new
                        {
                            status = report.Status.ToString(),
                            checks = report.Entries.Select(entry => new
                            {
                                name = entry.Key,
                                status = entry.Value.Status.ToString(),
                                exception = entry.Value.Exception != null ? entry.Value.Exception.Message : "none",
                                duration = entry.Value.Duration.ToString()
                            })
                        }
                    );

                    context.Response.ContentType = MediaTypeNames.Application.Json;
                    await context.Response.WriteAsync(result);
                }
            });

            endpoints.MapHealthChecks("/health/live", new HealthCheckOptions
            {
                Predicate = (_) => false
            });
        });
    }



}
public class program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
}

public class validation
{
    public static bool ContainsNumber(string str)
    {
        foreach (char c in str)
        {
            if (char.IsDigit(c))
            {
                return true;
            }
        }
        return false;
    }
}



