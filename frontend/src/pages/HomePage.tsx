import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Card, CardContent } from '../components/ui';

export const HomePage = () => {
  return (
    <Container>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
          Welcome to Meal Planner
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Organize your recipes, plan your weekly meals, and generate shopping lists with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Link to="/recipes">
          <Card hover padding="lg" className="h-full">
            <CardContent className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Recipe Library</h2>
              <p className="text-neutral-600">
                Browse, create, and manage your recipe collection with ingredients, instructions, and nutritional info.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/mealplans">
          <Card hover padding="lg" className="h-full">
            <CardContent className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Meal Planning</h2>
              <p className="text-neutral-600">
                Plan your weekly meals, randomize recipes based on preferences, and track what you cook.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/shopping">
          <Card hover padding="lg" className="h-full">
            <CardContent className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Shopping Lists</h2>
              <p className="text-neutral-600">
                Generate shopping lists from your meal plans with quantities, costs, and calories calculated automatically.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/recipes"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </Container>
  );
};
