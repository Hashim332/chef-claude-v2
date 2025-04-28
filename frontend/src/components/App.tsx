import Home from "@/pages/Home";
import Navbar from "./Navbar";
import Footer from "./Footer";

function App() {
  return (
    <div className="min-h-screen w-full p-4">
      <Navbar />
      <main className="flex-grow p-10">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
