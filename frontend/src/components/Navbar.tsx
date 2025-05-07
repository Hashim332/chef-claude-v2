import { Link } from "react-router-dom";
import chefLogo from "../assets/chef-claude-logo.png";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <nav className="flex flex-row justify-between">
      <Link to="/">
        <div className="flex flex-row items-center ml-10">
          <img
            src={chefLogo}
            alt="chef-claude"
            className="w-12 h-12 rounded-3xl"
          />
          <h1 className="text-3xl mx-4">Chef Claude</h1>
        </div>
      </Link>
      <ul className="flex flex-row items-center gap-8 mr-10 text-xl">
        <li>
          <SignedIn>
            <Link className="hover:text-primary" to="/your-recipes">
              Your Recipes
            </Link>
          </SignedIn>
        </li>
        <li>
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                className="text-xl hover:cursor-pointer"
                variant="default"
              >
                Sign in
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <SignOutButton>
              <Button
                className="text-xl hover:cursor-pointer"
                variant="outline"
              >
                Sign out
              </Button>
            </SignOutButton>
          </SignedIn>
        </li>
      </ul>
    </nav>
  );
}
