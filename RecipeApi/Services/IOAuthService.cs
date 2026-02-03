using Recipe.Api.Models;

namespace Recipe.Api.Services;

public interface IOAuthService
{
    string GetAuthorizationUrl(string state);
    Task<OAuthUserInfo> GetUserInfoFromCode(string code, CancellationToken ct = default);
}

public record OAuthUserInfo(
    string ProviderId,
    string Email,
    string DisplayName,
    bool EmailVerified
);
