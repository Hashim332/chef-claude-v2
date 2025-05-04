import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { RecipeGeneratorProvider } from "@/context/AppContext";
import YourRecipes from "@/pages/YourRecipesPage/YourRecipes";

function App() {
  return (
    <Router>
      <RecipeGeneratorProvider>
        <div className="min-h-screen w-full p-4 flex flex-col max-w-3xl mx-auto">
          <Navbar />
          <main className="flex-grow p-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/your-recipes" element={<YourRecipes />} />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </RecipeGeneratorProvider>
    </Router>
  );
}

export default App;
