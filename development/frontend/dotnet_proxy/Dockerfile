FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
# use forward headers
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
LABEL Maintainer="WeihanLi"
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app


COPY GithubProxySample.csproj ./
RUN dotnet restore ./GithubProxySample.csproj

COPY . .

WORKDIR /app
RUN dotnet publish -c Release -o out

# build runtime image
FROM base AS final
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "GithubProxySample.dll"]