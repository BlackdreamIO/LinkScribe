"use server"

import { doc, setDoc, collection, } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "@/database/firebase";
import { SectionScheme } from "@/scheme/Section";

export async function createSection(userEmail : string, data : string) : Promise<SectionScheme | any>
{
    try 
    {
        const parsedUpdatedDocument : SectionScheme = JSON.parse(data);
        const collectionRef = collection(db, userEmail);

        const docRef = doc(collectionRef, parsedUpdatedDocument.id);

        const response = await setDoc(docRef,  {
            id : parsedUpdatedDocument.id,
            title : parsedUpdatedDocument.title,
            links : parsedUpdatedDocument.links,
            totalLinksCount : parsedUpdatedDocument.totalLinksCount,
            created_at : parsedUpdatedDocument.created_at
        });
    
        revalidatePath('/app/Links/');

        return '';
    } 
    catch (error : any) {
        revalidatePath('/app/Links/');
        throw new Error(error?.message || 'An unknown error occurred');
    }
}