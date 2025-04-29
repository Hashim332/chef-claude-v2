import Home from "@/pages/Home";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { IngredientProvider } from "@/context/HomeContext";

function App() {
  return (
    <div className="min-h-screen w-full p-4 flex flex-col">
      <Navbar />
      <main className="flex-grow p-10">
        <IngredientProvider>
          <Home />
        </IngredientProvider>
      </main>
      <Footer />
    </div>
  );
}

export default App;
