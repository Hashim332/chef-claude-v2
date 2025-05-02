import Home from "@/pages/Home";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { RecipeGeneratorProvider } from "@/context/HomeContext";

function App() {
  return (
    <div className="min-h-screen w-full p-4 flex flex-col">
      <Navbar />
      <main className="flex-grow p-10">
        <RecipeGeneratorProvider>
          <Home />
        </RecipeGeneratorProvider>
      </main>
      <Footer />
    </div>
  );
}

export default App;
