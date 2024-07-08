
import { revalidatePath } from 'next/cache';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/database/firebase';
import { LinkScheme } from '@/scheme/Link';

export async function updateLink(userEmail: string, documentId: string, linkData: string): Promise<void> {
    try {

        const parsedLinkData = JSON.parse(linkData);

        const docRef = doc(db, userEmail, documentId);

        // Fetch the document snapshot
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const sectionData = docSnap.data();

            if (sectionData) {
                // Update the links array
                const updatedLinks = sectionData.links.map((link: LinkScheme) => {
                    if (link.id === parsedLinkData.id) {
                        return {
                            ...link,
                            title: parsedLinkData.title,
                            url: parsedLinkData.url,
                            visitCount: parsedLinkData.visitCount,
                            created_at: new Date()
                        };
                    }
                    return link;
                });

                // Update the document with the updated links array
                await updateDoc(docRef, {
                    links: updatedLinks
                });

                revalidatePath('/app/Links/');
                return;
            }
        }
        else
        {
            throw new Error(`Document with ID ${documentId} does not exist or could not be fetched.`);
        }
    }
    catch (error: any) {
        revalidatePath('/app/Links/');
        throw new Error(error?.message || 'An unknown error occurred');
    }
}
