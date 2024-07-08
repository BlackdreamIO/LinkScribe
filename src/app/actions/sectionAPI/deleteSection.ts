"use server"

import { revalidatePath } from "next/cache";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/database/firebase";
import { SectionScheme } from "@/scheme/Section";

export async function deleteSection(userEmail : string, documentId : string, revalidateUrl="/app/Links") : Promise<SectionScheme | any>
{
    try 
    {
        const docRef = doc(db, userEmail, documentId);

        const response = await deleteDoc(docRef);
    
        revalidatePath(revalidateUrl);

        return response;
    } 
    catch (error : any) {
        revalidatePath(revalidateUrl);
        throw new Error(error?.message || 'An unknown error occurred');
    }
}