import express from "express";
import { db } from "../src/firebase";
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";
import { requireAuth, getAuth } from "@clerk/express";

const router = express.Router();

router.use(express.json());

router.post("/save-recipe", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  //   const recipe = req.body;
  const recipe = {
    recipeName: "test recipe",
    recipeSummary: "test summary",
    fullRecipe: "test full recipe",
  };

  if (!userId || !recipe) {
    res.status(400).json({ error: "userId and recipe are required" });
    return;
  }

  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await updateDoc(userRef, recipe);
    } else {
      await setDoc(userRef, {
        recipe: recipe,
      });
      console.log("recipe saved!!!");
    }

    res.status(200).json({ message: "Recipe saved successfully" });
  } catch (err) {
    console.error("An error ocurred with writing to db", err);
  }
});

export default router;
