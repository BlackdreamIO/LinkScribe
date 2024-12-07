"use server"
//import { addDoc, collection, getDocs } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function createCollection(collectionName : string) : Promise<any> {
    try
    {
        return []
    }
    catch (error : any) {
        throw new Error(error);
    }
}