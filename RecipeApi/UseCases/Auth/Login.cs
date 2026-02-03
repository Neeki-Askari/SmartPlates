using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;
using Recipe.Api.Services;

namespace Recipe.Api.UseCases.Auth;

public class Login(
    AppDbContext db,
    IPasswordHasher passwordHasher,
    ITokenService tokenService)
{
    public async Task<AuthResponseDto> Execute(LoginDto dto, CancellationToken ct = default)
    {
        // Find user by email
        var user = await db.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower(), ct);

        if (user is null)
            throw new UnauthorizedAccessException("Invalid email or password");

        // Verify this is a local account (not OAuth)
        if (user.PasswordHash is null)
            throw new UnauthorizedAccessException("This account uses OAuth sign-in");

        // Verify password
        if (!passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password");

        // Generate new tokens
        var accessToken = tokenService.GenerateAccessToken(user);
        var refreshToken = tokenService.GenerateRefreshToken();

        // Update refresh token in database
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        user.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        return new AuthResponseDto(
            accessToken,
            refreshToken,
            new UserDto(
                user.Id,
                user.Email,
                user.DisplayName,
                user.CreatedAt
            )
        );
    }
}
