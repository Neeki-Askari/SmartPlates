using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.Auth;

public class SyncAuth0User(AppDbContext db)
{
    public async Task<User> Execute(string auth0SubjectId, string email, string displayName, CancellationToken ct = default)
    {
        // Try to find user by Auth0 subject ID
        var user = await db.Users
            .FirstOrDefaultAsync(u => u.Auth0SubjectId == auth0SubjectId, ct);

        if (user is not null)
        {
            // Update existing user info if changed
            var updated = false;
            if (user.Email != email)
            {
                user.Email = email;
                updated = true;
            }
            if (user.DisplayName != displayName)
            {
                user.DisplayName = displayName;
                updated = true;
            }

            if (updated)
            {
                user.UpdatedAt = DateTime.UtcNow;
                await db.SaveChangesAsync(ct);
            }

            return user;
        }

        // Try to find user by email (for account linking)
        user = await db.Users
            .FirstOrDefaultAsync(u => u.Email == email, ct);

        if (user is not null)
        {
            // Link Auth0 to existing account
            user.Auth0SubjectId = auth0SubjectId;
            user.DisplayName = displayName;
            user.EmailVerified = true; // Auth0 users are verified
            user.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
            return user;
        }

        // Create new user
        user = new User
        {
            Id = Guid.NewGuid(),
            Auth0SubjectId = auth0SubjectId,
            Email = email,
            DisplayName = displayName,
            EmailVerified = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Users.Add(user);
        await db.SaveChangesAsync(ct);

        return user;
    }
}
