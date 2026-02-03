using System.Text.RegularExpressions;

namespace Recipe.Api.Services;

public static class PasswordValidator
{
    private const int MinLength = 8;
    private static readonly Regex HasUpperCase = new(@"[A-Z]", RegexOptions.Compiled);
    private static readonly Regex HasLowerCase = new(@"[a-z]", RegexOptions.Compiled);
    private static readonly Regex HasDigit = new(@"[0-9]", RegexOptions.Compiled);
    private static readonly Regex HasSpecialChar = new(@"[^a-zA-Z0-9]", RegexOptions.Compiled);

    public static (bool IsValid, string? ErrorMessage) Validate(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            return (false, "Password is required");

        if (password.Length < MinLength)
            return (false, $"Password must be at least {MinLength} characters long");

        if (!HasUpperCase.IsMatch(password))
            return (false, "Password must contain at least one uppercase letter");

        if (!HasLowerCase.IsMatch(password))
            return (false, "Password must contain at least one lowercase letter");

        if (!HasDigit.IsMatch(password))
            return (false, "Password must contain at least one number");

        if (!HasSpecialChar.IsMatch(password))
            return (false, "Password must contain at least one special character");

        return (true, null);
    }
}
