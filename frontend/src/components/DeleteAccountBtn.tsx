import { useAuth } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function DeleteAccountBtn() {
  // fetch is going to be a delete req, send the user id/token
  const { getToken } = useAuth();
  const navigate = useNavigate();

  async function handleDeleteAccount() {
    console.log("Deleting account");

    try {
      const token = await getToken();

      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.isDeleted) {
        console.log("Account deleted");
        navigate("/");
      } else {
        console.error("Error deleting account");
      }
    } catch (err) {
      console.error("Error deleting account", err);
    }
  }

  return (
    <Button variant="outline" onClick={handleDeleteAccount}>
      Delete Account
    </Button>
  );
}
