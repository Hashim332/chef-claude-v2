import express from "express";
import { db } from "../src/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { requireAuth, getAuth } from "@clerk/express";
import { Recipe } from "../utils/recipeUtils";

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
      const docData = doc.data();
      const recipeData = docData.recipe as Omit<Recipe, "recipeId">;
      userRecipes.push({ recipeId: doc.id, ...recipeData });
      console.log(userRecipes);
    });

    res.status(200).json({ allSavedRecipes: userRecipes });
    return;
  } catch (err) {
    console.error("An error ocurred with writing to db", err);
  }
});

router.delete("/user-recipes/:recipeId", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const recipeId = req.params["recipeId"];
  console.log("recipe to be deleted: ", recipeId);

  if (!userId) {
    res.status(400).json({ error: "invalid userId" });
    return;
  }

  try {
    await deleteDoc(doc(db, "users", userId, "recipes", recipeId));
    res.status(200).json();
    return;

    // the DELETE endpoint should only handle deletion, not return data
    // deprecated code only for reference

    // const querySnapshot = await getDocs(
    //   collection(db, "users", userId, "recipes")
    // );

    // let userRecipes: Recipe[] = [];
    // querySnapshot.forEach((doc) => {
    //   // Type assertion to tell TypeScript that the document data matches Recipe type
    //   const docData = doc.data();
    //   const recipeData = docData.recipe as Omit<Recipe, "recipeId">;
    //   userRecipes.push({ recipeId: doc.id, ...recipeData });
    //   console.log("updated recipes: ", userRecipes);
    // });

    // res.status(200).json({ allSavedRecipes: userRecipes });
  } catch (err) {
    console.error("Error deleting document", err);
  }
});

export default router;
