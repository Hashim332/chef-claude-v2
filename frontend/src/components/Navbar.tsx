import chefLogo from "../assets/chef-claude-logo.png";

export default function Navbar() {
  return (
    <div className="flex flex-row">
      <a href="/">
        <div className="flex flex-row  items-center ml-2">
          <img
            src={chefLogo}
            alt="chef-claude"
            className="w-12 h-12 rounded-3xl"
          />
          <h1 className="text-3xl mx-4">Chef Claude</h1>
        </div>
      </a>
    </div>
  );
}
