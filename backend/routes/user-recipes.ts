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

router.get("/user-recipes", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(400).json({ error: "userId and recipe are required" });
    return;
  }

  try {
    const docRef = doc(db, "users", userId, "recipes");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap);
    }
    res.status(200).json({ docsnap: docSnap });
  } catch (err) {
    console.error("An error ocurred with writing to db", err);
  }
});

export default router;
