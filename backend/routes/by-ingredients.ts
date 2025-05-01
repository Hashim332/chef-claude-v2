import express from "express";

const router = express.Router();

router.use(express.json());

router.post("/recipes/by-ingredients", async (req, res) => {
  const { ingredients } = req.body;
  console.log(ingredients);
});

export default router;
