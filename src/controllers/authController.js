import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import dotenv from "dotenv";
import { db, objectId } from "../dbStrategy/mongodb.js";

dotenv.config();

export async function signUp(req, res) {
  const registerSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    passwordConfirm: joi.string().required(),
  });

  const user = req.body;

  const { error } = registerSchema.validate(user);

  if (error) {
    return res.sendStatus(422);
  }

  if (user.password !== user.passwordConfirm) {
    return res.status(401).send("Senhas devem ser iguais");
  }

  const passCrypt = bcrypt.hashSync(user.password, 10);

  try {
    const userExists = await db
      .collection("users")
      .findOne({ name: user.name });

    const emailExists = await db
      .collection("users")
      .findOne({ email: user.email });

    if (userExists || emailExists) {
      return res.sendStatus(409);
    }

    await db.collection("users").insertOne({
      name: user.name,
      email: user.email,
      password: passCrypt,
      saldo: 0,
    });

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const user = req.body;

  const { error } = loginSchema.validate(user);

  if (error) {
    return res.sendStatus(422);
  }

  try {
    const emailExists = await db
      .collection("users")
      .findOne({ email: user.email });

    if (!emailExists) {
      return res.status(404).send("Usuário não cadastrado");
    }

    const comparePassword = bcrypt.compareSync(
      user.password,
      emailExists.password
    );

    if (emailExists && comparePassword) {
      const token = uuid();

      const session = await db
        .collection("sessions")
        .findOne({ userId: objectId(emailExists._id) });

      if (session !== null) {
        await db
          .collection("sessions")
          .deleteOne({ userId: objectId(emailExists._id) });

        await db.collection("sessions").insertOne({
          token: token,
          userId: objectId(emailExists._id),
        });
      } else {
        await db.collection("sessions").insertOne({
          token: token,
          userId: objectId(emailExists._id),
        });
      }

      return res
        .status(200)
        .send({ token, email: user.email, name: emailExists.name });
    } else {
      return res.status(401).send("Senha ou email incorretos!");
    }
  } catch (error) {
    res.status(500).send("erro");
  }
}
