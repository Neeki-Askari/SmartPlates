import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { RecipesPage } from './pages/RecipesPage';
import { MealPlansPage } from './pages/MealPlansPage';
import { ShoppingListPage } from './pages/ShoppingListPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/mealplans" element={<MealPlansPage />} />
          <Route path="/shopping" element={<ShoppingListPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
