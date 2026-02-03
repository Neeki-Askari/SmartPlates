using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;

namespace Recipe.Api.Extensions;

public static class HttpContextExtensions
{
    public static async Task<Guid?> GetCurrentUserIdAsync(this HttpContext httpContext, AppDbContext db, CancellationToken ct = default)
    {
        // Get Auth0 subject ID from token
        var auth0Sub = httpContext.User.FindFirst("sub")?.Value
            ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(auth0Sub))
            return null;

        // Find user by Auth0 subject ID
        var user = await db.Users
            .Where(u => u.Auth0SubjectId == auth0Sub)
            .Select(u => u.Id)
            .FirstOrDefaultAsync(ct);

        return user == Guid.Empty ? null : user;
    }
}
