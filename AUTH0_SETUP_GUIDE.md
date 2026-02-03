# Auth0 Integration Setup Guide

This guide will walk you through setting up Auth0 authentication for your Meal Planner application.

## Overview

Auth0 has been integrated into your application to provide secure authentication. Users can:
- Browse recipes without logging in (public access)
- Must log in to access Meal Plans and Shopping Lists (protected features)
- Use various login methods (Google, Apple, Microsoft, email/password, etc.) configured through Auth0

## Step 1: Create Auth0 Account and Application

### 1.1 Sign Up for Auth0
1. Go to [https://auth0.com/](https://auth0.com/)
2. Click "Sign Up" and create a free account
3. Complete the onboarding process

### 1.2 Create an Application
1. In your Auth0 Dashboard, go to **Applications** → **Applications**
2. Click **Create Application**
3. Enter application name: `Meal Planner` (or your preferred name)
4. Select application type: **Single Page Web Applications**
5. Click **Create**

### 1.3 Configure Application Settings

In your new application's settings page:

#### Allowed Callback URLs
Add these URLs (comma-separated):
```
http://localhost:5173, http://localhost:5173/callback
```

#### Allowed Logout URLs
Add:
```
http://localhost:5173
```

#### Allowed Web Origins
Add:
```
http://localhost:5173
```

#### Allowed Origins (CORS)
Add:
```
http://localhost:5173
```

**Important**: When you deploy to production, add your production URLs to all these fields.

Click **Save Changes** at the bottom of the page.

## Step 2: Get Your Auth0 Credentials

From your application's settings page, copy the following values:

1. **Domain** - Located at the top (e.g., `dev-abc123.us.auth0.com`)
2. **Client ID** - Located below the domain
3. **Client Secret** - Located below the Client ID (click "Show" to reveal)

## Step 3: Configure Your Application

### 3.1 Frontend Configuration

Open `frontend/.env` and replace the placeholders with your Auth0 credentials:

```env
VITE_API_URL=http://localhost:5076/api

# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-auth0-domain.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://your-auth0-domain.us.auth0.com/api/v2/
VITE_AUTH0_REDIRECT_URI=http://localhost:5173
```

**Note**: The `VITE_AUTH0_AUDIENCE` should be set to your API identifier if you created one, or you can use the default shown above.

### 3.2 Backend Configuration (Optional)

If you want to verify Auth0 tokens on your backend, open `RecipeApi/.env` and update:

```env
# Auth0 Configuration
AUTH0_DOMAIN=your-auth0-domain.us.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_AUDIENCE=https://your-auth0-domain.us.auth0.com/api/v2/
```

## Step 4: Configure Social Connections (Optional)

Auth0 allows users to log in with social providers like Google, Apple, and Microsoft.

### 4.1 Enable Social Connections
1. In Auth0 Dashboard, go to **Authentication** → **Social**
2. Enable the providers you want:
   - **Google** - Click and follow the setup wizard
   - **Apple** - Click and follow the setup wizard
   - **Microsoft** - Click and follow the setup wizard

### 4.2 Default: Username/Password
By default, Auth0 enables username-password authentication. Users can:
- Sign up with email and password
- Password requirements are configurable in **Authentication** → **Database** → **Username-Password-Authentication** → **Password Policy**

## Step 5: Test Your Integration

### 5.1 Start Your Application

```bash
# Start the backend (from RecipeApi directory)
dotnet run

# Start the frontend (from frontend directory)
npm run dev
```

### 5.2 Test Authentication Flow

1. Open your browser to `http://localhost:5173`
2. You should see the homepage with three feature cards
3. Click the **Login** button in the header
4. You'll be redirected to Auth0's Universal Login page
5. Create a new account or log in
6. After successful login, you'll be redirected back to your app
7. Verify that:
   - The header now shows "Meal Plans" and "Grocery Lists" links
   - Your name/email appears in the header
   - A "Logout" button is visible
   - Clicking on Meal Plans or Grocery Lists cards navigates to those pages without showing a login modal

### 5.3 Test Public Access

1. Click "Logout" in the header
2. Verify that:
   - "Meal Plans" and "Grocery Lists" links are hidden from the header
   - Only "Recipes" link is visible
   - Clicking on Meal Plans or Grocery Lists cards shows a login modal
   - You can still access the Recipes page

## Step 6: Customize Authentication (Optional)

### 6.1 Customize Login Page
1. Go to **Branding** → **Universal Login**
2. Choose a template or customize the login page appearance
3. Add your logo and brand colors

### 6.2 Configure Password Policy
1. Go to **Authentication** → **Database**
2. Click on **Username-Password-Authentication**
3. Go to **Password Policy** tab
4. Configure requirements:
   - Minimum length: 8 characters
   - Require uppercase: Yes
   - Require lowercase: Yes
   - Require numbers: Yes
   - Require special characters: Yes

### 6.3 Enable Multi-Factor Authentication (Recommended)
1. Go to **Security** → **Multi-factor Auth**
2. Enable desired MFA methods (SMS, Authenticator App, etc.)
3. Configure policies for when MFA is required

## Architecture Overview

### Authentication Flow

```
User clicks "Login"
    ↓
Redirected to Auth0 Universal Login
    ↓
User authenticates (Google, email/password, etc.)
    ↓
Auth0 redirects back to app with auth code
    ↓
Auth0Provider exchanges code for tokens
    ↓
User is authenticated in the app
    ↓
Access token is included in API requests (if needed)
```

### Protected vs Public Routes

**Public Routes** (no authentication required):
- Homepage (`/`)
- Recipes page (`/recipes`)

**Protected Routes** (authentication required):
- Meal Plans page (`/mealplans`)
- Grocery Lists page (`/grocery-lists`)
- Shopping List page (`/shopping`)

### Files Modified

**Frontend:**
- `frontend/.env` - Auth0 configuration
- `frontend/src/App.tsx` - Wrapped app with Auth0Provider
- `frontend/src/components/layout/Header.tsx` - Added login/logout buttons, conditional nav links
- `frontend/src/pages/HomePage.tsx` - Added login modals for protected features
- `frontend/src/components/common/LoginModal.tsx` - Created login prompt modal

**Backend:**
- `RecipeApi/.env` - Auth0 configuration placeholders

## Troubleshooting

### "Invalid state" error
- Make sure your allowed callback URLs in Auth0 match exactly
- Clear browser cache and cookies
- Verify `.env` file has correct domain and client ID

### Login redirects but user not authenticated
- Check browser console for errors
- Verify Auth0 domain and client ID are correct
- Ensure application type in Auth0 is "Single Page Application"

### CORS errors
- Verify "Allowed Web Origins" includes your frontend URL
- Make sure backend CORS is configured to allow frontend origin

### Can't see protected links after login
- Check browser console for Auth0 errors
- Verify `isAuthenticated` is returning true (add console.log in Header component)
- Clear localStorage and try logging in again

## Production Deployment

Before deploying to production:

1. **Update Auth0 Application Settings**:
   - Add production URLs to all allowed URL fields
   - Example: `https://yourdomain.com`

2. **Update Environment Variables**:
   - Update `VITE_AUTH0_REDIRECT_URI` to production URL
   - Ensure all Auth0 credentials are set via environment variables (not hardcoded)

3. **Enable HTTPS**:
   - Auth0 requires HTTPS in production
   - Configure SSL/TLS certificates for your domain

4. **Security Hardening**:
   - Enable MFA for all users
   - Configure token expiration policies
   - Set up monitoring and logging
   - Enable anomaly detection in Auth0

## Additional Resources

- [Auth0 React SDK Documentation](https://auth0.com/docs/libraries/auth0-react)
- [Auth0 Dashboard](https://manage.auth0.com/)
- [Auth0 Community](https://community.auth0.com/)

## Support

If you encounter any issues:
1. Check the Auth0 logs in your dashboard (Monitoring → Logs)
2. Review the browser console for errors
3. Consult the Auth0 documentation
4. Reach out to Auth0 support (available on free tier)
