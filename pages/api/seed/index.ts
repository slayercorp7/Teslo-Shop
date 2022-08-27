import type { NextApiRequest, NextApiResponse } from "next";
import { db, seedDb } from "../../../database";
import { Order, Product, User } from "../../../models";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV === "production") {
    return res.status(401).json({ message: "no tiene acceso a este servicio" });
  }

  await db.connect(); // utilizando la conexion a la db

  await Product.deleteMany();

  await User.deleteMany();
  await User.insertMany(seedDb.initialData.users);
  //utiliza el modelo para realizar operaciones, delete many borra todos los
  //anteriores registros(purgar la data de la coleccion)

  await Product.insertMany(seedDb.initialData.products);
  await Order.deleteMany()
  await db.disconnect(); //hacer la desconexion para no saturar el servidor

  res.status(200).json({ message: "Proceso Correcto" });
}
