# OAuth Integration Setup Guide

This guide explains how to configure and use OAuth authentication with Google, Apple, and Microsoft providers.

## Overview

The API now supports three OAuth providers:
- **Google OAuth 2.0**
- **Apple Sign In**
- **Microsoft OAuth 2.0** (Azure AD)

Users can sign in using any of these providers or create a manual account with username/password.

## Configuration

### Environment Variables

All OAuth configuration is stored in the `.env` file. You need to obtain credentials from each provider you want to enable.

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Select "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:5173/auth/google/callback` (development)
   - Your production callback URL
7. Copy the Client ID and Client Secret to `.env`:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

### 2. Apple Sign In Setup

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Create a new App ID with "Sign in with Apple" capability
4. Create a Service ID for your web application
5. Configure the Service ID with your domain and redirect URLs
6. Create a private key for Sign in with Apple
7. Download the private key (.p8 file) and convert to base64:

```bash
base64 -i AuthKey_XXXXXXXXXX.p8 | tr -d '\n'
```

8. Add to `.env`:

```env
APPLE_CLIENT_ID=com.yourcompany.yourapp
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_KEY_ID
APPLE_PRIVATE_KEY=base64-encoded-private-key
APPLE_REDIRECT_URI=http://localhost:5173/auth/apple/callback
```

### 3. Microsoft OAuth Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Name your application
5. Select "Accounts in any organizational directory and personal Microsoft accounts"
6. Add redirect URI: `http://localhost:5173/auth/microsoft/callback`
7. After creation, go to "Certificates & secrets" → "New client secret"
8. Copy Application (client) ID and client secret to `.env`:

```env
MICROSOFT_CLIENT_ID=your-application-id
MICROSOFT_CLIENT_SECRET=your-client-secret
MICROSOFT_REDIRECT_URI=http://localhost:5173/auth/microsoft/callback
```

## API Endpoints

### Get OAuth Authorization URL

**GET** `/api/auth/{provider}/url?state={optional-state}`

Returns the authorization URL to redirect users to the OAuth provider's login page.

**Parameters:**
- `provider` (path): One of `google`, `apple`, or `microsoft`
- `state` (query, optional): Custom state parameter for CSRF protection

**Response:**
```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
}
```

**Example:**
```bash
curl http://localhost:5000/api/auth/google/url
```

### Handle OAuth Callback

**POST** `/api/auth/{provider}/callback`

Exchanges the authorization code for user tokens and creates/logs in the user.

**Parameters:**
- `provider` (path): One of `google`, `apple`, or `microsoft`

**Body:**
```json
{
  "code": "authorization-code-from-provider",
  "state": "optional-state-value"
}
```

**Response:**
```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": "user-guid",
    "email": "user@example.com",
    "displayName": "User Name",
    "createdAt": "2025-01-05T00:00:00Z"
  }
}
```

## Frontend Integration Flow

### 1. Initiate OAuth Login

```typescript
// Get the authorization URL
const response = await fetch('http://localhost:5000/api/auth/google/url');
const { url } = await response.json();

// Redirect user to OAuth provider
window.location.href = url;
```

### 2. Handle OAuth Callback

Your frontend should have a callback route (e.g., `/auth/google/callback`) that:

```typescript
// Extract the code from URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

// Exchange code for tokens
const response = await fetch('http://localhost:5000/api/auth/google/callback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code })
});

const { accessToken, refreshToken, user } = await response.json();

// Store tokens (localStorage, cookies, or state management)
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// Redirect to app
window.location.href = '/';
```

### 3. Use Access Token

```typescript
// Make authenticated requests
const response = await fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});
```

## User Account Linking

The OAuth implementation automatically handles account linking:

1. **New User**: If email doesn't exist, creates a new user account
2. **Existing Email**: If a user with the same email exists, links the OAuth provider to that account
3. **Existing OAuth**: If the OAuth provider ID already exists, logs in that user

This allows users to:
- Sign in with multiple OAuth providers using the same email
- Link OAuth providers to existing manual accounts
- Seamlessly switch between authentication methods

## Security Features

- **Email Verification**: OAuth providers' email verification status is honored
- **Token Rotation**: Refresh tokens are rotated on each refresh
- **Provider Validation**: Only supported providers are allowed
- **State Parameter**: Supports CSRF protection via state parameter
- **Secure Token Storage**: Refresh tokens are stored hashed in the database

## Testing OAuth Locally

For local development:

1. Configure each provider's redirect URI to `http://localhost:5173/auth/{provider}/callback`
2. Make sure your frontend runs on port 5173 (or update redirect URIs)
3. Test the OAuth flow:
   - Click login button → redirects to provider
   - Authenticate with provider → redirects back to your app
   - Exchange code for tokens → user is logged in

## Production Deployment

Before deploying to production:

1. Update redirect URIs in each provider's settings to your production domain
2. Update `.env` with production redirect URIs
3. Use HTTPS for all redirect URIs (required by providers)
4. Rotate all secrets and use strong values
5. Consider using environment-specific configurations

## Troubleshooting

### "OAuth provider not configured" error

Make sure the provider's credentials are set in `.env` file and the application has been restarted.

### "Invalid redirect_uri" error

Ensure the redirect URI in `.env` matches exactly what's configured in the provider's settings (including http/https, port, and path).

### "No email received from provider"

Check that the OAuth scopes include email access. Users may also need to grant email permission during authentication.

### Apple Sign In issues

- Private key must be base64 encoded without line breaks
- Team ID, Key ID, and Client ID must match your Apple Developer configuration
- Service ID must be properly configured with your domain

## Next Steps

1. Configure OAuth providers you want to support
2. Implement frontend OAuth flows
3. Test the complete authentication flow
4. Add proper error handling and user feedback
5. Implement token refresh logic on the frontend
