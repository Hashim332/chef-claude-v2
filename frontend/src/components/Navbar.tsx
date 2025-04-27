import chefLogo from "../assets/chef-claude-logo.png";

export default function Navbar() {
  return (
    <div className="flex flex-row items-center">
      <img src={chefLogo} alt="chef-claude" className="w-14 h-14" />
      <h1 className="text-xl">Chef Claude</h1>
    </div>
  );
}
