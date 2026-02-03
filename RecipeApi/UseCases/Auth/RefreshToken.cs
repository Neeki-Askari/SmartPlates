using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;
using Recipe.Api.Services;

namespace Recipe.Api.UseCases.Auth;

public class RefreshToken(
    AppDbContext db,
    ITokenService tokenService)
{
    public async Task<AuthResponseDto> Execute(RefreshTokenDto dto, CancellationToken ct = default)
    {
        // Find user with matching refresh token
        var user = await db.Users
            .FirstOrDefaultAsync(u => u.RefreshToken == dto.RefreshToken, ct);

        if (user is null)
            throw new UnauthorizedAccessException("Invalid refresh token");

        // Check if refresh token is expired
        if (user.RefreshTokenExpiry is null || user.RefreshTokenExpiry < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Refresh token expired");

        // Generate new tokens
        var accessToken = tokenService.GenerateAccessToken(user);
        var newRefreshToken = tokenService.GenerateRefreshToken();

        // Update refresh token in database (token rotation)
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        user.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        return new AuthResponseDto(
            accessToken,
            newRefreshToken,
            new UserDto(
                user.Id,
                user.Email,
                user.DisplayName,
                user.CreatedAt
            )
        );
    }
}
