import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { jwt, validations } from "../../../utils";

type Data =
  | { message: string }
  | { token: string; user: { email: string; role: string; name: string } };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return registerUser(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    email = "",
    password = "",
    name = "",
  } = req.body as { name: string; email: string; password: string };

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "contraseña debe tener 6 caracteres" });
  }
  if (name.length < 3) {
    return res
      .status(400)
      .json({ message: "el nombre debe ser mayor a 3 caracteres" });
  }

  if (!validations.isValidEmail(email)) {
    return res.status(400).json({ message: "el correo no es valido" });
  }

  await db.connect();

  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ message: "el correo ya esta registrado" });
  }

  const newUser = new User({
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password),
    role: "client",
    name,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "revisar logs del servidor" });
  }

  const { _id, role } = newUser;
  const token = jwt.signToken(_id, email);

  res.status(200).json({
    token,
    user: { email, role, name },
  });
};
