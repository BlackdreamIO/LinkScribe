"use server"

import { revalidatePath } from "next/cache";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/database/firebase";
import { SectionScheme } from "@/scheme/Section";

export async function deleteSection(userEmail : string, documentId : string) : Promise<SectionScheme | any>
{
    try 
    {
        const docRef = doc(db, userEmail, documentId);

        const response = await deleteDoc(docRef);
    
        revalidatePath('/app/Links/');

        return response;
    } 
    catch (error : any) {
        revalidatePath('/app/Links/');
        throw new Error(error?.message || 'An unknown error occurred');
    }
}