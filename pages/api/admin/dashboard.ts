import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "../../../database";
import { Order, Product, User } from "../../../models";

type Data =
  | {
      numberOfOrders: number;
      paidOrders: number; // ispaid: true
      notPaidOrders: number;
      numberOfClients: number; // client
      numberOfProducts: number;
      productsWithNoInventory: number; //0
      lowInventory: number; // 10 o menos articulos en stock
    }
  | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await db.connect();

  //   const numberOfOrders = await Order.estimatedDocumentCount();
  //   const paidOrders = await Order.count({ isPaid: true });
  //   const notPaidOrders = await Order.count({ isPaid: false });
  //   const numberOfClients = await User.count({ role: "client" });
  //   const numberOfProducts = await Product.estimatedDocumentCount();
  //   const productsWithNoInventory = await Product.count({ inStock: 0 });
  //   const lowInventory = await Product.find({ inStock: { $lte: 10 } }).count();

  //   const data = {
  //     numberOfOrders,
  //     paidOrders,
  //     notPaidOrders,
  //     numberOfClients,
  //     numberOfProducts,
  //     productsWithNoInventory,
  //     lowInventory,
  //   };
  const [
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  ] = await Promise.all([
    Order.estimatedDocumentCount(),
    Order.count({ isPaid: true }),
    Order.count({ isPaid: false }),
    User.count({ role: "client" }),
    Product.estimatedDocumentCount(),
    Product.count({ inStock: 0 }),
    Product.find({ inStock: { $lte: 10 } }).count(),
  ]);
  const data = {
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
      };
      
  await db.disconnect();

  return res.status(200).json(data);
}
