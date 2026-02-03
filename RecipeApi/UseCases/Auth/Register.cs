using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;
using Recipe.Api.Services;

namespace Recipe.Api.UseCases.Auth;

public class Register(
    AppDbContext db,
    IPasswordHasher passwordHasher,
    ITokenService tokenService)
{
    public async Task<AuthResponseDto> Execute(RegisterDto dto, CancellationToken ct = default)
    {
        // Validate password strength
        var (isValid, errorMessage) = PasswordValidator.Validate(dto.Password);
        if (!isValid)
            throw new InvalidOperationException(errorMessage);

        // Check if email already exists
        var existingUser = await db.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower(), ct);

        if (existingUser is not null)
            throw new InvalidOperationException("Email already registered");

        // Hash password
        var passwordHash = passwordHasher.HashPassword(dto.Password);

        // Create user
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email.ToLower(),
            DisplayName = dto.DisplayName,
            PasswordHash = passwordHash,
            OAuthProvider = null,
            OAuthProviderId = null,
            EmailVerified = false, // In production, send verification email
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Generate tokens
        var accessToken = tokenService.GenerateAccessToken(user);
        var refreshToken = tokenService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        db.Users.Add(user);
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
