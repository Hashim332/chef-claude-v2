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
    // Increased horizontal padding (px-6) and removed ml-10/mr-10 to rely on padding for spacing
    <nav className="flex flex-row justify-between px-6 py-2">
      <a href="/">
        {/* Removed ml-10, relying on nav padding */}
        <div className="flex flex-row items-center">
          <img
            src={chefLogo}
            alt="chef-claude"
            className="w-12 h-12 rounded-3xl"
          />
          {/* Reduced text size on small screens (text-2xl), kept original 3xl from sm breakpoint */}
          <h1 className="text-2xl sm:text-3xl mx-4">Chef Claude</h1>
        </div>
      </a>

      {/* Reduced text size on small screens (text-lg), kept original xl from sm breakpoint */}
      {/* Removed mr-10, relying on nav padding */}
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
              {/* Reduced text size on small screens (text-base), kept original sm:text-lg for larger screens */}
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
              {/* Reduced text size on small screens (text-base), kept original sm:text-lg for larger screens */}
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
