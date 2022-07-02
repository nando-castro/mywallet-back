import express from "express";
import cors from "cors";

import { createFinance, deleteFinance, getFinance, updateFinance } from "./controllers/financeController.js";
import { getUser, signIn, signUp } from "./controllers/authController.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.post("/sign-up", signUp);
app.post("/sign-in", signIn);

app.get("/sign-in", getUser);

//Finances
app.get("/finances", getFinance);
app.post("/finances", createFinance);
app.delete("/finances/:id", deleteFinance);
app.put("/finances/:id", updateFinance);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is litening on port ${PORT} `);
});
