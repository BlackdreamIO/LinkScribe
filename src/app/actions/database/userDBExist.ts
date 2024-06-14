"use server"

import { db } from "@/database/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

export async function userDBExist(collectionName : string) : Promise<boolean> {
    try
    {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        return !snapshot.empty;
    }
    catch (error : any) {
        throw new Error(error);
    }
}