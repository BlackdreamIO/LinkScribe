"use server"

//import { addDoc, collection, getDocs } from "firebase/firestore";

export async function userDBExist(collectionName : string) : Promise<boolean> {
    try
    {
        return false;
    }
    catch (error : any) {
        throw new Error(error);
    }
}