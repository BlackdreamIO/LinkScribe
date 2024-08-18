import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { SectionScheme } from "@/scheme/Section";

interface IGetSections {
    token : string;
    email: string;
    sectionData : SectionScheme;
    onSuccess? : (data : any) => void;
    onError? : (error : any) => void;
}

/**
 * Creates a new section in the "sections" table of the Supabase database.
 *
 * @param {Object} options - The options for creating the section.
 * @param {string} options.token - The token for authentication.
 * @param {Function} [options.onSuccess] - The callback function to be called on success.
 * @param {Function} [options.onError] - The callback function to be called on error.
 * @param {string} options.email - The email associated with the section.
 * @param {SectionScheme} options.sectionData - The data of the section to be created.
 * @return {Promise<Object[]|void>} - The created section data on success, or an empty array on error.
 */
export async function CreateSection({ token, onSuccess, onError, email, sectionData} : IGetSections)
{
    try
    {
        const { data, error, status, statusText } = await CreateSupabaseServerDBClient(token).from("sections").insert({
            id : sectionData.id,
            title : sectionData.title,
            //totalLinksCount : sectionData.totalLinksCount,
            //links : sectionData.links,
            links_layout : sectionData.links_layout,
            selfLayout : sectionData.selfLayout,
            section_ref : email,
            created_at : new Date(sectionData.created_at).toISOString(),
            // _deleted : sectionData._deleted
        });
        
        if(!error && status == 201) {
            onSuccess?.(statusText);
            return data;
        }
        else if(error || status != 201) {
            console.error("Error While Creating Section : [LN :: 33 >> CREATE_SECTION()] | ", error);
            onError?.(statusText);
            return [];
        }
    }
    catch (error) {
        console.error("Error While Deleting Section : ");
        onError?.(error);
        return [];
    }
}