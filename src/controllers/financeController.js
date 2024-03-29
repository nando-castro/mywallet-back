import joi from "joi";
import dayjs from "dayjs";
import dotenv from "dotenv";
import { db, objectId } from "../dbStrategy/mongodb.js";

dotenv.config();

const financeSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  type: joi.string().valid("add", "exit"),
});

export async function getFinance(req, res) {
  const session = res.locals.session;

  const finances = await db
    .collection("finances")
    .find({ userId: session.userId })
    .sort({ date: -1 })
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

  await db.collection("finances").insertOne({
    ...finance,
    time: dayjs().format("DD/MM"),
    createdAt: new Date(),
    userId: objectId(session.userId),
  });
  res.sendStatus(201);
}

export async function deleteFinance(req, res) {
  const id = req.params.id;
  const session = res.locals.session;

  const value = await db
    .collection("finances")
    .findOne({ _id: new objectId(id), userId: session.userId });

  if (value === null) {
    return res.sendStatus(401);
  }

  try {
    await db.collection("finances").deleteOne({ _id: new objectId(id) });

    res.sendStatus(200);
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
      .findOne({ _id: new objectId(id) });
    if (!value) {
      return res.sendStatus(404);
    }

    await db
      .collection("finances")
      .updateOne({ _id: value._id }, { $set: req.body });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
