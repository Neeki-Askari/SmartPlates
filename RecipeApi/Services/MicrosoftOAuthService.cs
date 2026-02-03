using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace Recipe.Api.Services;

public class MicrosoftOAuthService : IOAuthService
{
    private readonly string _clientId;
    private readonly string _clientSecret;
    private readonly string _redirectUri;
    private readonly HttpClient _httpClient;

    public MicrosoftOAuthService(IConfiguration configuration, HttpClient httpClient)
    {
        _clientId = configuration["Microsoft:ClientId"]
            ?? throw new InvalidOperationException("Microsoft:ClientId not configured");
        _clientSecret = configuration["Microsoft:ClientSecret"]
            ?? throw new InvalidOperationException("Microsoft:ClientSecret not configured");
        _redirectUri = configuration["Microsoft:RedirectUri"] ?? "http://localhost:5173/auth/microsoft/callback";
        _httpClient = httpClient;
    }

    public string GetAuthorizationUrl(string state)
    {
        var scopes = Uri.EscapeDataString("openid profile email");
        return $"https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" +
               $"client_id={_clientId}&" +
               $"redirect_uri={Uri.EscapeDataString(_redirectUri)}&" +
               $"response_type=code&" +
               $"scope={scopes}&" +
               $"state={state}&" +
               $"response_mode=query";
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
            ["grant_type"] = "authorization_code",
            ["scope"] = "openid profile email"
        };

        var tokenResponse = await _httpClient.PostAsync(
            "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            new FormUrlEncodedContent(tokenRequest),
            ct
        );

        tokenResponse.EnsureSuccessStatusCode();
        var tokenData = await tokenResponse.Content.ReadAsStringAsync(ct);
        var tokenJson = JsonDocument.Parse(tokenData);
        var accessToken = tokenJson.RootElement.GetProperty("access_token").GetString()
            ?? throw new InvalidOperationException("No access token received from Microsoft");

        // Get user info using access token
        _httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

        var userInfoResponse = await _httpClient.GetAsync(
            "https://graph.microsoft.com/v1.0/me",
            ct
        );

        userInfoResponse.EnsureSuccessStatusCode();
        var userInfoData = await userInfoResponse.Content.ReadAsStringAsync(ct);
        var userInfoJson = JsonDocument.Parse(userInfoData);

        var providerId = userInfoJson.RootElement.GetProperty("id").GetString()
            ?? throw new InvalidOperationException("No user ID received from Microsoft");
        var email = userInfoJson.RootElement.GetProperty("userPrincipalName").GetString()
            ?? userInfoJson.RootElement.GetProperty("mail").GetString()
            ?? throw new InvalidOperationException("No email received from Microsoft");
        var displayName = userInfoJson.RootElement.GetProperty("displayName").GetString() ?? email;

        // Microsoft Graph API doesn't directly provide email verification status
        // We'll assume it's verified since Microsoft handles their own verification
        var emailVerified = true;

        return new OAuthUserInfo(providerId, email, displayName, emailVerified);
    }
}
