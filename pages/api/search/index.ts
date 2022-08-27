import type { NextApiRequest, NextApiResponse } from "next";
import { IProduct } from "../../../interfaces";


type Data = { message: string } | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
        return res.status(404).json({ message: "API-Rest not found" });

    default:
      return res.status(400).json({ message: "Bad Request" });
    }
}

