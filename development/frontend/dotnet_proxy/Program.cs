using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddTransforms((context) =>
    {
        if (context.Route.ClusterId == "githubimages")
        {
            context.AddRequestTransform(transformContext =>
            {
                var path = transformContext.HttpContext.Request.Path.Value?.Replace("/blob/", "/") ?? "/";
                var url = "https://raw.githubusercontent.com" + path + transformContext.HttpContext.Request.QueryString;
                transformContext.ProxyRequest.RequestUri = new Uri(url);
                return default;
            });
        }
    });

var app = builder.Build();
app.MapReverseProxy();
app.Run();
