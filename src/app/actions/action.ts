"use server"

import { db } from "@/database/firebase";
import { collection, getDocs } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function getSections() 
{
    // const documents = await fetch('https://663c4a1517145c4d8c35b1ee.mockapi.io/links', {
    //     method : 'get',
    //     headers: {
    //         "Content-Type": "application/json",
    //         // 'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     cache : 'no-store'
    // })

    try {
        const documentsCollectionRef = collection(db, 'document');
        const documentsSnapshot = await getDocs(documentsCollectionRef);

        const documents = documentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
        }));
    
        revalidatePath('/');
        return documents;
    } 
    catch (error) {
        revalidatePath('/');
        return [];
    }

    // revalidatePath('/');

    // const documentsJSON = await documents.json();

    // return documentsJSON;
}