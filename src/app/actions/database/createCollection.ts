"use server"

import { db } from "@/database/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

export async function createCollection(collectionName : string) : Promise<any> {
    try
    {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);

        if(snapshot.empty) {
            await addDoc(collectionRef, {
                title : 'USER DB ACTIVATED' + Math.random() * 10
            });
        }
        return "ALREADY EXIST"
    }
    catch (error : any) {
        throw new Error(error);
    }
}