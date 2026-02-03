import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { RecipesPage } from "./pages/RecipesPage";
import { MealPlansPage } from "./pages/MealPlansPage";
import { ShoppingListPage } from "./pages/ShoppingListPage";
import { GroceryListPage } from "./pages/GroceryListPage";
import { setTokenGetter } from "./services/api";
import { UserProvider } from "./contexts/UserContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
const redirectUri =
  import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin;

// Inner component to handle Auth0 hooks
function AppContent() {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // Set up token getter for API calls
    setTokenGetter(async () => {
      try {
        return await getAccessTokenSilently();
      } catch (error) {
        console.error("Failed to get access token:", error);
        return "";
      }
    });
  }, [getAccessTokenSilently]);

  return (
    <ErrorBoundary>
      <UserProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/mealplans" element={<MealPlansPage />} />
            <Route path="/shopping" element={<ShoppingListPage />} />
            <Route path="/grocery-lists" element={<GroceryListPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </UserProvider>
    </ErrorBoundary>
  );
}

function App() {
  // Build auth params conditionally
  const authParams: any = {
    redirect_uri: redirectUri,
  };

  // Only include audience if it's properly set (not the placeholder)
  if (audience && !audience.includes("replace")) {
    authParams.audience = audience;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={authParams}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <Router>
        <AppContent />
      </Router>
    </Auth0Provider>
  );
}

export default App;
