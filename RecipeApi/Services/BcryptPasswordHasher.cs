using BCrypt.Net;

namespace Recipe.Api.Services;

public class BcryptPasswordHasher : IPasswordHasher
{
    private const int WorkFactor = 12; // BCrypt work factor (higher = more secure but slower)

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(password, passwordHash);
        }
        catch
        {
            return false;
        }
    }
}
