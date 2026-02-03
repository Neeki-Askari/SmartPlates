using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace Recipe.Api.Services;

public class GoogleOAuthService : IOAuthService
{
    private readonly string _clientId;
    private readonly string _clientSecret;
    private readonly string _redirectUri;
    private readonly HttpClient _httpClient;

    public GoogleOAuthService(IConfiguration configuration, HttpClient httpClient)
    {
        _clientId = configuration["Google:ClientId"]
            ?? throw new InvalidOperationException("Google:ClientId not configured");
        _clientSecret = configuration["Google:ClientSecret"]
            ?? throw new InvalidOperationException("Google:ClientSecret not configured");
        _redirectUri = configuration["Google:RedirectUri"] ?? "http://localhost:5173/auth/google/callback";
        _httpClient = httpClient;
    }

    public string GetAuthorizationUrl(string state)
    {
        var scopes = Uri.EscapeDataString("openid profile email");
        return $"https://accounts.google.com/o/oauth2/v2/auth?" +
               $"client_id={_clientId}&" +
               $"redirect_uri={Uri.EscapeDataString(_redirectUri)}&" +
               $"response_type=code&" +
               $"scope={scopes}&" +
               $"state={state}&" +
               $"access_type=offline&" +
               $"prompt=consent";
    }

    public async Task<OAuthUserInfo> GetUserInfoFromCode(string code, CancellationToken ct = default)
    {
        // Exchange authorization code for access token
        var tokenRequest = new Dictionary<string, string>
        {
            ["code"] = code,
            ["client_id"] = _clientId,
            ["client_secret"] = _clientSecret,
            ["redirect_uri"] = _redirectUri,
            ["grant_type"] = "authorization_code"
        };

        var tokenResponse = await _httpClient.PostAsync(
            "https://oauth2.googleapis.com/token",
            new FormUrlEncodedContent(tokenRequest),
            ct
        );

        tokenResponse.EnsureSuccessStatusCode();
        var tokenData = await tokenResponse.Content.ReadAsStringAsync(ct);
        var tokenJson = JsonDocument.Parse(tokenData);
        var accessToken = tokenJson.RootElement.GetProperty("access_token").GetString()
            ?? throw new InvalidOperationException("No access token received from Google");

        // Get user info using access token
        _httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

        var userInfoResponse = await _httpClient.GetAsync(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            ct
        );

        userInfoResponse.EnsureSuccessStatusCode();
        var userInfoData = await userInfoResponse.Content.ReadAsStringAsync(ct);
        var userInfoJson = JsonDocument.Parse(userInfoData);

        var providerId = userInfoJson.RootElement.GetProperty("id").GetString()
            ?? throw new InvalidOperationException("No user ID received from Google");
        var email = userInfoJson.RootElement.GetProperty("email").GetString()
            ?? throw new InvalidOperationException("No email received from Google");
        var name = userInfoJson.RootElement.GetProperty("name").GetString() ?? email;
        var emailVerified = userInfoJson.RootElement.TryGetProperty("verified_email", out var verifiedElement)
            && verifiedElement.GetBoolean();

        return new OAuthUserInfo(providerId, email, name, emailVerified);
    }
}
