"use server"

import { collection, getDocsFromServer } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "@/database/firebase";
import { SectionScheme } from "@/scheme/Section";

export async function getSections(userEmail : string, revalidateUrl="/app/Links") : Promise<SectionScheme[]>
{
    try 
    {
        const documentsCollectionRef = collection(db, userEmail);
        const documentsSnapshot = await getDocsFromServer(documentsCollectionRef);

        const documents = documentsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return <SectionScheme>{
                id: doc.id,
                title: data.title,
                totalLinksCount: data?.links?.length || 0,
                links: data.links,
                created_at: data.created_at,
                _deleted : false,
                linksLayout : data.linksLayout || "Grid Detailed",
                timestamp : new Date().toISOString()
            };
        });
    
        revalidatePath(revalidateUrl);
        
        return documents;
    } 
    catch (error : any) {
        revalidatePath(revalidateUrl);
        throw new Error(error?.message || 'An unknown error occurred');
    }
}