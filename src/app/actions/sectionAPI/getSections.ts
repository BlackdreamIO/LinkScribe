"use server"

import { collection, getDocsFromServer } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "@/database/firebase";
import { SectionScheme } from "@/scheme/Section";
import { redis } from "@/database/redis";

export async function getSections(userEmail : string, revalidateUrl="/app/Links") : Promise<SectionScheme[]>
{
    try 
    {
        const cachedSections = await redis.get(`${userEmail}_sections`);

        if(cachedSections) {
            revalidatePath(revalidateUrl);
            return JSON.parse(cachedSections);
        }

        const documentsCollectionRef = collection(db, userEmail);
        const documentsSnapshot = await getDocsFromServer(documentsCollectionRef);

        const documents = documentsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                totalLinksCount: data?.links?.length || [],
                links: data.links,
                created_at: data.created_at,
            };
        });
    
        revalidatePath(revalidateUrl);
        
        redis.set(`${userEmail}_sections`, JSON.stringify(documents));
        return documents;
    } 
    catch (error : any) {
        revalidatePath(revalidateUrl);
        throw new Error(error?.message || 'An unknown error occurred');
    }
}