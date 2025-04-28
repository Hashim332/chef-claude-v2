import Navbar from "./Navbar";
import { Button } from "./ui/button";
import { SignInButton, SignedOut } from "@clerk/clerk-react";

function App() {
  return (
    <div className="bg-[#f5f0e8] min-h-screen w-full p-4">
      <Navbar />
      <h1 className="">hello world</h1>
      <Button>Click me!</Button>
    </div>
  );
}

export default App;
