import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { SectionScheme } from "@/scheme/Section";

interface IUpdateSection {
    token: string;
    email: string;
    sectionData: SectionScheme;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

/**
 * Updates a section in the Supabase database.
 *
 * @param {string} options.token - The token for authentication.
 * @param {Function} [options.onSuccess] - The callback function to be called on success.
 * @param {Function} [options.onError] - The callback function to be called on error.
 * @param {string} options.email - The email associated with the section.
 * @param {SectionScheme} options.sectionData - The data of the section to be updated.
 * @return {Promise<Object[]|void>} - The updated section data on success, or an empty array on error.
 */
export async function UpdateSection({ token, onSuccess, onError, email, sectionData }: IUpdateSection) {
    try
    {
        const updatedSection : any = {
            id : sectionData.id,
            title : sectionData.title,
            links_layout : sectionData.links_layout,
            selfLayout : sectionData.selfLayout,
            section_ref : email,
            //created_at : new Date(sectionData.created_at).toISOString(),
            //totalLinksCount : sectionData.totalLinksCount,
            //links : sectionData.links,
            // _deleted : sectionData._deleted
        }

        const { data, error, status, statusText } = await CreateSupabaseServerDBClient(token)
            .from("sections")
            .update(updatedSection)
            .eq('id', sectionData.id);

        if (!error) {
            onSuccess?.(status);
            return data;
        }
        else if(error) {
            console.error("Error While Updating Section : [LN :: 33 >> UPDATE_SECTION()] | ", error);
            onError?.(statusText);
            return [];
        }
    }
    catch (error) {
        console.error("Error While Updating Section : ");
        onError?.(error);
        return [];
    }
}
