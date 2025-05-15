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
    <nav className="flex flex-row justify-between px-6 py-2">
      <a href="/">
        <div className="flex flex-row items-center">
          <img
            src={chefLogo}
            alt="chef-claude"
            className="w-12 h-12 rounded-3xl"
          />
          <h1 className="text-2xl sm:text-3xl mx-4">Chef Claude</h1>
        </div>
      </a>

      <ul className="flex flex-row items-center gap-8 text-lg sm:text-xl">
        <li>
          <SignedIn>
            <a className="text" href="/your-recipes">
              Your Recipes
            </a>
          </SignedIn>
        </li>

        <li className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                className="text-base sm:text-lg hover:cursor-pointer"
                variant="default"
              >
                Sign in
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <SignOutButton>
              <Button
                className="text-base sm:text-lg hover:cursor-pointer"
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
