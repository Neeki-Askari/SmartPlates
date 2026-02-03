using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;
using Recipe.Api.Services;

namespace Recipe.Api.UseCases.Auth;

public class OAuthLogin(
    AppDbContext db,
    ITokenService tokenService)
{
    public async Task<AuthResponseDto> Execute(
        string provider,
        OAuthUserInfo userInfo,
        CancellationToken ct = default)
    {
        // Normalize provider name
        provider = provider.ToLower();

        // Check if user exists with this OAuth provider
        var user = await db.Users
            .FirstOrDefaultAsync(u =>
                u.OAuthProvider == provider &&
                u.OAuthProviderId == userInfo.ProviderId,
                ct);

        // If user doesn't exist, check if email is already registered
        if (user is null)
        {
            var existingUser = await db.Users
                .FirstOrDefaultAsync(u => u.Email == userInfo.Email, ct);

            if (existingUser is not null)
            {
                // Link OAuth provider to existing account
                existingUser.OAuthProvider = provider;
                existingUser.OAuthProviderId = userInfo.ProviderId;
                existingUser.EmailVerified = userInfo.EmailVerified || existingUser.EmailVerified;
                existingUser.UpdatedAt = DateTime.UtcNow;
                user = existingUser;
            }
            else
            {
                // Create new user
                user = new User
                {
                    Id = Guid.NewGuid(),
                    Email = userInfo.Email,
                    DisplayName = userInfo.DisplayName,
                    OAuthProvider = provider,
                    OAuthProviderId = userInfo.ProviderId,
                    EmailVerified = userInfo.EmailVerified,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                db.Users.Add(user);
            }
        }
        else
        {
            // Update existing OAuth user
            user.DisplayName = userInfo.DisplayName;
            user.EmailVerified = userInfo.EmailVerified || user.EmailVerified;
            user.UpdatedAt = DateTime.UtcNow;
        }

        // Generate tokens
        var accessToken = tokenService.GenerateAccessToken(user);
        var refreshToken = tokenService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await db.SaveChangesAsync(ct);

        var userDto = new UserDto(
            user.Id,
            user.Email,
            user.DisplayName,
            user.CreatedAt
        );

        return new AuthResponseDto(accessToken, refreshToken, userDto);
    }
}
