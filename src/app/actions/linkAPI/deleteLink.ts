"use server"

import { revalidatePath } from 'next/cache';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/database/firebase';
import { LinkScheme } from '@/scheme/Link';

export async function deleteLink(userEmail: string, documentId: string, linkId: string, revalidateUrl="/app/Links"): Promise<void> {
    try {
        const docRef = doc(db, userEmail, documentId);

        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const sectionData = docSnap.data();

            if (sectionData && sectionData.links) {

                const updatedLinks = sectionData.links.filter((link: LinkScheme) => link.id !== linkId);

                await updateDoc(docRef, {
                    links: updatedLinks
                });

                revalidatePath(revalidateUrl || '/app/Links/');
                return;
            }
            else {
                throw new Error('Section data or links array is missing.');
            }
        }
        else {
            throw new Error(`Document with ID ${documentId} does not exist or could not be fetched.`);
        }
    }
    catch (error: any) {
        revalidatePath(revalidateUrl || '/app/Links/');
        throw new Error(error?.message || 'An unknown error occurred');
    }
}
