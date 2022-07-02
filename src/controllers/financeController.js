import joi from "joi";
import dayjs from "dayjs";
import dotenv from "dotenv";

import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect(() => {
  db = mongoClient.db(process.env.MONGO_DATABASE_NAME);
});

const financeSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required()
  });  

export async function getFinance(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  const session = await db.collection("sessions").findOne({ token });

  if (!session) {
    return res.sendStatus(401);
  }

  const finances = await db
    .collection("finances")
    .find({ userId: new ObjectId(session.userId) })
    .toArray();

  res.send(finances);
}

export async function createFinance(req, res) {
  const finance = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  const { error } = financeSchema.validate(finance);

  if (error) {
    return res.sendStatus(422);
  }

  const session = await db.collection("sessions").findOne({ token });

  if (!session) {
    return res.sendStatus(401);
  }

  await db
    .collection("finances")
    .insertOne({ ...finance, type: "", time: dayjs().format("HH:mm:ss"), userId: session.userId });
  res.sendStatus(201);
}

export async function deleteFinance(req, res) {
  const id = req.params.id;

  const value = await db
    .collection("finances")
    .findOne({ _id: new ObjectId(id) });

  if (!value) {
    res.sendStatus(422);
  }

  try {
    await db.collection("finances").deleteOne({ _id: new ObjectId(id) });

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function updateFinance(req, res) {
  const id = req.params.id;
  const value = req.body;

  const { error } = financeSchema.validate(value, { abortEarly: true });

  if (error) {
    res.sendStatus(422);
    return;
  }

  try {
    const value = await db
      .collection("finances")
      .findOne({ _id: new ObjectId(id) });
    if (!value) {
      return res.sendStatus(404);
    }

    await db
      .collection("finances")
      .updateOne({ _id: value._id }, { $set: req.body });

    res.send(value);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
