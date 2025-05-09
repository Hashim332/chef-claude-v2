import express from "express";
import { db } from "../src/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
  addDoc,
  getDoc,
  collection,
} from "firebase/firestore";
import { requireAuth, getAuth } from "@clerk/express";
import { Recipe } from "./by-ingredients";

const router = express.Router();

router.use(express.json());

router.post("/save-recipe", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const recipe = req.body;
  //   const recipe = {
  //     recipeName: "test recipe",
  //     recipeSummary: "test summary",
  //     fullRecipe: "test full recipe",
  //   };

  if (!userId || !recipe) {
    res.status(400).json({ error: "userId and recipe are required" });
    return;
  }

  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    const saveRecipe = async (userId: any, recipeData: Recipe) => {
      // 1. Point at the subcollection
      const recipesCol = collection(db, "users", userId, "recipes");

      // 2. Add the document — returns a ref with the new ID
      const docRef = await addDoc(recipesCol, recipeData);

      console.log("New recipe ID:", docRef.id);
    };

    saveRecipe(userId, recipe);

    res.status(200).json({ message: "Recipe saved successfully" });
  } catch (err) {
    console.error("An error ocurred with writing to db", err);
  }
});

export default router;
