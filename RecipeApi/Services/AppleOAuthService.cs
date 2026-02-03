using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Recipe.Api.Services;

public class AppleOAuthService : IOAuthService
{
    private readonly string _clientId;
    private readonly string _teamId;
    private readonly string _keyId;
    private readonly string _privateKey;
    private readonly string _redirectUri;
    private readonly HttpClient _httpClient;

    public AppleOAuthService(IConfiguration configuration, HttpClient httpClient)
    {
        _clientId = configuration["Apple:ClientId"]
            ?? throw new InvalidOperationException("Apple:ClientId not configured");
        _teamId = configuration["Apple:TeamId"]
            ?? throw new InvalidOperationException("Apple:TeamId not configured");
        _keyId = configuration["Apple:KeyId"]
            ?? throw new InvalidOperationException("Apple:KeyId not configured");
        _privateKey = configuration["Apple:PrivateKey"]
            ?? throw new InvalidOperationException("Apple:PrivateKey not configured");
        _redirectUri = configuration["Apple:RedirectUri"] ?? "http://localhost:5173/auth/apple/callback";
        _httpClient = httpClient;
    }

    public string GetAuthorizationUrl(string state)
    {
        var scopes = Uri.EscapeDataString("name email");
        return $"https://appleid.apple.com/auth/authorize?" +
               $"client_id={_clientId}&" +
               $"redirect_uri={Uri.EscapeDataString(_redirectUri)}&" +
               $"response_type=code&" +
               $"scope={scopes}&" +
               $"state={state}&" +
               $"response_mode=form_post";
    }

    public async Task<OAuthUserInfo> GetUserInfoFromCode(string code, CancellationToken ct = default)
    {
        // Generate client secret (JWT signed with Apple private key)
        var clientSecret = GenerateClientSecret();

        // Exchange authorization code for tokens
        var tokenRequest = new Dictionary<string, string>
        {
            ["code"] = code,
            ["client_id"] = _clientId,
            ["client_secret"] = clientSecret,
            ["redirect_uri"] = _redirectUri,
            ["grant_type"] = "authorization_code"
        };

        var tokenResponse = await _httpClient.PostAsync(
            "https://appleid.apple.com/auth/token",
            new FormUrlEncodedContent(tokenRequest),
            ct
        );

        tokenResponse.EnsureSuccessStatusCode();
        var tokenData = await tokenResponse.Content.ReadAsStringAsync(ct);
        var tokenJson = JsonDocument.Parse(tokenData);

        var idToken = tokenJson.RootElement.GetProperty("id_token").GetString()
            ?? throw new InvalidOperationException("No id_token received from Apple");

        // Decode the ID token to get user info
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(idToken);

        var providerId = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value
            ?? throw new InvalidOperationException("No user ID in Apple ID token");
        var email = jwtToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value
            ?? throw new InvalidOperationException("No email in Apple ID token");
        var emailVerified = jwtToken.Claims.FirstOrDefault(c => c.Type == "email_verified")?.Value == "true";

        // Apple doesn't always provide name in the ID token, use email as fallback
        var name = email.Split('@')[0];

        return new OAuthUserInfo(providerId, email, name, emailVerified);
    }

    private string GenerateClientSecret()
    {
        var now = DateTime.UtcNow;
        var claims = new[]
        {
            new Claim("iss", _teamId),
            new Claim("iat", new DateTimeOffset(now).ToUnixTimeSeconds().ToString()),
            new Claim("exp", new DateTimeOffset(now.AddMonths(6)).ToUnixTimeSeconds().ToString()),
            new Claim("aud", "https://appleid.apple.com"),
            new Claim("sub", _clientId)
        };

        // Parse the private key (ES256 algorithm)
        var privateKeyBytes = Convert.FromBase64String(_privateKey);
        var ecdsa = ECDsa.Create();
        ecdsa.ImportPkcs8PrivateKey(privateKeyBytes, out _);

        var signingCredentials = new SigningCredentials(
            new ECDsaSecurityKey(ecdsa),
            SecurityAlgorithms.EcdsaSha256
        );

        var header = new JwtHeader(signingCredentials);
        header["kid"] = _keyId;

        var payload = new JwtPayload(claims);
        var token = new JwtSecurityToken(header, payload);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
