import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import financeRouter from "./routes/financeRouter.js";
import validateUser from './middlewares/validateUser.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(validateUser, financeRouter);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is litening on port ${PORT} `);
});
