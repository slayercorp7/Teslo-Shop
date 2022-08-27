import { isValidObjectId } from "mongoose";
import { IOrder } from "../interfaces";
import { db } from '.';
import { Order } from "../models";


export const getOrderById = async (id:string): Promise<IOrder | null> => {
    
    if(!isValidObjectId(id)){
        return null;
    }


    await db.connect()

    const order = await Order.findById(id).lean();

    await db.disconnect()

    if(!order){
        return null;
    }

    return JSON.parse(JSON.stringify(order))
}


export const getOrdersByUser = async (id:string): Promise<IOrder[]> => {

    if(!isValidObjectId(id)){
        return [];
    }


    await db.connect()

    const orders = await Order.find({user: id}).lean();
    console.log(orders)

    await db.disconnect()

    if(!orders){
        return [];
    }

    return JSON.parse(JSON.stringify(orders))

}