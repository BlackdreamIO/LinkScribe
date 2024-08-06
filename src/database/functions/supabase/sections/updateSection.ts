import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { SectionScheme } from "@/scheme/Section";

interface IUpdateSection {
    token: string;
    email: string;
    sectionData: SectionScheme;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

export async function UpdateSection({ token, onSuccess, onError, email, sectionData }: IUpdateSection) {
    try
    {
        const updatedSection : any = {
            id : sectionData.id,
            title : sectionData.title,
            //totalLinksCount : sectionData.totalLinksCount,
            //links : sectionData.links,
            linksLayout : sectionData.linksLayout,
            selfLayout : sectionData.selfLayout,
            section_ref : email,
            created_at : new Date(sectionData.created_at).toISOString(),
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
