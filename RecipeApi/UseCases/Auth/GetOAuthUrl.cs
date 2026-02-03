using Recipe.Api.Services;

namespace Recipe.Api.UseCases.Auth;

public class GetOAuthUrl
{
    private readonly Dictionary<string, IOAuthService> _oauthServices;

    public GetOAuthUrl(
        GoogleOAuthService googleService,
        AppleOAuthService appleService,
        MicrosoftOAuthService microsoftService)
    {
        _oauthServices = new Dictionary<string, IOAuthService>(StringComparer.OrdinalIgnoreCase)
        {
            ["google"] = googleService,
            ["apple"] = appleService,
            ["microsoft"] = microsoftService
        };
    }

    public string Execute(string provider, string? state = null)
    {
        state ??= Guid.NewGuid().ToString();

        if (!_oauthServices.TryGetValue(provider, out var service))
        {
            throw new InvalidOperationException($"Unsupported OAuth provider: {provider}");
        }

        return service.GetAuthorizationUrl(state);
    }
}
