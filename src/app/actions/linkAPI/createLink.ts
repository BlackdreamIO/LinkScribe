"use server"

import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "@/database/firebase";
import { SectionScheme } from "@/scheme/Section";
import { LinkScheme } from "@/scheme/Link";

export async function createLink(userEmail : string, documentId : string, linkData : string) : Promise<SectionScheme | any>
{
    try 
    {
        const parsedLinkData : LinkScheme = JSON.parse(linkData);
        const docRef = doc(db, userEmail, documentId);

        const response = await setDoc(docRef, { links : arrayUnion(parsedLinkData) }, { merge : true });
    
        revalidatePath('/app/Links/');

        return response;
    } 
    catch (error : any) {
        revalidatePath('/app/Links/');
        throw new Error(error?.message || 'An unknown error occurred');
    }
}