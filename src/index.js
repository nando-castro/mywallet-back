import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import dayjs from "dayjs";
import joi from "joi";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect(() => {
  db = mongoClient.db(process.env.MONGO_DATABASE_NAME);
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
    const registerSchema = joi.object({
      name: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().required(),
      passconfirm: joi.string().required()
    });
  
    const user = req.body;
  
    const { error } = registerSchema.validate(user);
  
    if (error) {
      return res.sendStatus(422);
    }
  
    if(user.password !== user.passconfirm){
        return res.sendStatus(404);
    }
  
    try {
        const userExists = await db.collection('users').findOne({ name: user.name });
        
        const emailExists = await db.collection('users').findOne({ email: user.email });
  
        if(userExists || emailExists){
            return res.sendStatus(409);
        }
  
        await db.collection('users').insertOne({ name: user.name, email: user.email, password: user.password });
  
        res.sendStatus(201);
  
    } catch (error) {
        res.sendStatus(500);
    }
  
  });

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is litening on port ${PORT} `);
});
