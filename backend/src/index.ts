import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (_req, res) => {
  res.send("Hello from Express + TypeScript!");
  const { userId } = getAuth(_req);
  console.log(userId);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
