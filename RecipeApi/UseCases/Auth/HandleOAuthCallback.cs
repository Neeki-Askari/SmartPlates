using Recipe.Api.Models;
using Recipe.Api.Services;

namespace Recipe.Api.UseCases.Auth;

public class HandleOAuthCallback
{
    private readonly Dictionary<string, IOAuthService> _oauthServices;
    private readonly OAuthLogin _oauthLogin;

    public HandleOAuthCallback(
        GoogleOAuthService googleService,
        AppleOAuthService appleService,
        MicrosoftOAuthService microsoftService,
        OAuthLogin oauthLogin)
    {
        _oauthServices = new Dictionary<string, IOAuthService>(StringComparer.OrdinalIgnoreCase)
        {
            ["google"] = googleService,
            ["apple"] = appleService,
            ["microsoft"] = microsoftService
        };
        _oauthLogin = oauthLogin;
    }

    public async Task<AuthResponseDto> Execute(
        string provider,
        string code,
        CancellationToken ct = default)
    {
        if (!_oauthServices.TryGetValue(provider, out var service))
        {
            throw new InvalidOperationException($"Unsupported OAuth provider: {provider}");
        }

        // Get user info from OAuth provider
        var userInfo = await service.GetUserInfoFromCode(code, ct);

        // Login or create user
        return await _oauthLogin.Execute(provider, userInfo, ct);
    }
}
