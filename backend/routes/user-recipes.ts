import express from "express";
import { db } from "../src/firebase";
import { collection, getDocs } from "firebase/firestore";
import { requireAuth, getAuth } from "@clerk/express";
import { Recipe } from "./by-ingredients";

const router = express.Router();

router.use(express.json());
router.get("/user-recipes", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(400).json({ error: "invalid userId" });
    return;
  }

  try {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "recipes")
    );

    let userRecipes: Recipe[] = [];
    querySnapshot.forEach((doc) => {
      // Type assertion to tell TypeScript that the document data matches Recipe type
      const recipeData = doc.data() as Omit<Recipe, "recipeId">;
      userRecipes.push({ recipeId: doc.id, ...recipeData });
    });

    res.status(200).json({ allSavedRecipes: userRecipes });
    return;
  } catch (err) {
    console.error("An error ocurred with writing to db", err);
  }
});

export default router;
