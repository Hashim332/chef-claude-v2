import { clerkClient, getAuth, requireAuth } from "@clerk/express";
import express from "express";

const router = express.Router();

router.use(express.json());

router.delete("/user/delete", requireAuth(), async (req, res) => {
  console.log("Deleting account");
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    console.log("Deleting account");

    await clerkClient.users.deleteUser(userId);

    console.log("Account deleted, USER ID: ", userId);

    res.status(200).json({ message: "Account deleted", isDeleted: true });
    return;
  } catch (err) {
    console.error("Error deleting account", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

export default router;
