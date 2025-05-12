import express from "express";
import { db } from "../src/firebase";
// import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { requireAuth, getAuth } from "@clerk/express";
import { Recipe } from "./by-ingredients";

const router = express.Router();

router.use(express.json());
//TODO: attach recipeId to
router.get("/user-recipes", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(400).json({ error: "userId and recipe are required" });
    return;
  }

  try {
    // const docRef = doc(db, "users", userId);
    // const docSnap = await getDoc(docRef);

    // if (docSnap.exists()) {
    //   console.log(docSnap.data());
    // }
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "recipes")
    );
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
    let allRecipes: any = [];
    querySnapshot.forEach((doc) => {
      // Add both the document ID and data to the array
      allRecipes.push({
        id: doc.id,
        ...doc.data(), // Spread the document data
      });
    });

    res.status(200).json({ allSavedRecipes: allRecipes });
  } catch (err) {
    console.error("An error ocurred with writing to db", err);
  }
});

export default router;
