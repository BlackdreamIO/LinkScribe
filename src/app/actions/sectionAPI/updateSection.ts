"use server"

import { doc, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "@/database/firebase";
import { SectionScheme } from "@/scheme/Section";

export async function updateSection(userEmail : string, documentId : string, updatedDocument : string) : Promise<SectionScheme | any>
{
    try 
    {
        const parsedUpdatedDocument = JSON.parse(updatedDocument);
        const docRef = doc(db, userEmail, documentId);

        const response = await updateDoc(docRef, parsedUpdatedDocument);
    
        revalidatePath('/app/Links/');

        return response;
    } 
    catch (error : any) {
        revalidatePath('/app/Links/');
        throw new Error(error?.message || 'An unknown error occurred');
    }
}