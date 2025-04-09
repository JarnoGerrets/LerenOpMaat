FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy only csproj to restore
COPY ["LOM.API/LOM.API.csproj", "LOM.API/"]
WORKDIR /src/LOM.API
RUN dotnet restore

# Copy rest of the source
WORKDIR /src
COPY . .

WORKDIR /src/LOM.API

# Build the API project only
RUN dotnet build "LOM.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR /src/LOM.API
RUN dotnet publish "LOM.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LOM.API.dll"]