using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddTransforms(context =>
    {
        if (context.Route.ClusterId == "githubImages")
        {
            context.AddRequestTransform(transformContext =>
            {
                var path = transformContext.HttpContext.Request.Path.Value
                            ?.Replace("/blob/", "/").Replace("/raw/", "/")
                        ?? "/";
                var query = transformContext.HttpContext.Request.QueryString.HasValue
                    ? $"?{transformContext.HttpContext.Request.QueryString}"
                    : "";
                var url = $"https://raw.githubusercontent.com{path}{query}";
                transformContext.ProxyRequest.RequestUri = new Uri(url);
                return default;
            });
        }
    });

var app = builder.Build();
app.MapReverseProxy();
app.Run();
