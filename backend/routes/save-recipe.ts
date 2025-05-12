import express from "express";
import { db } from "../src/firebase";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import { requireAuth, getAuth } from "@clerk/express";
import { Recipe } from "./by-ingredients";

const router = express.Router();

router.use(express.json());

router.post("/save-recipe", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const recipe = req.body;
  console.log(recipe);

  if (!userId || !recipe) {
    res.status(400).json({ error: "userId and recipe are required" });
    return;
  }

  try {
    // point to recipe section
    const recipesRef = collection(db, "users", userId, "recipes");
    // add recipe
    await addDoc(recipesRef, recipe);

    console.log("Recipe added with ID: ", recipesRef.id);
    res.status(200).json({ recipeId: recipesRef.id });
  } catch (err) {
    console.error("An error ocurred with writing to db", err);
  }
});

export default router;
