import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { SectionScheme } from "@/scheme/Section";

interface IGetSections {
    token : string;
    email: string;
    sectionData : SectionScheme;
    onSuccess? : (data : any) => void;
    onError? : (error : any) => void;
}

export async function CreateSection({ token, onSuccess, onError, email, sectionData} : IGetSections)
{
    try
    {
        const { data, error, status, statusText } = await CreateSupabaseServerDBClient(token).from("sections").insert({
            id : sectionData.id,
            title : sectionData.title,
            //totalLinksCount : sectionData.totalLinksCount,
            //links : sectionData.links,
            linksLayout : sectionData.linksLayout,
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