import chefLogo from "../assets/chef-claude-logo.png";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <nav className="flex flex-row justify-between">
      <a href="/">
        <div className="flex flex-row  items-center ml-10">
          <img
            src={chefLogo}
            alt="chef-claude"
            className="w-12 h-12 rounded-3xl"
          />
          <h1 className="text-3xl mx-4">Chef Claude</h1>
        </div>
      </a>
      <ul className="flex flex-row items-center gap-8 mr-10 text-xl">
        <li>
          <a href="">Contact</a>
        </li>
        <li className="hover:bg-black/10 hover:cursor-pointer">
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <SignOutButton />
          </SignedIn>
        </li>
      </ul>
    </nav>
  );
}
