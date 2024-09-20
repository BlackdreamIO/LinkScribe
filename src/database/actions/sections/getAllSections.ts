import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { SectionScheme } from "@/scheme/Section";

interface IGetSections {
    token : string;
    email : string;
    withLinks? : boolean;

    onSuccess? : (sections : SectionScheme[]) => void;
    onEmpty? : () => void;
    onError? : (error : any) => void;
}

export async function GetSections({ email, token, withLinks=true, onSuccess, onError, onEmpty } : IGetSections) : Promise<SectionScheme[]>
{
    try
    {
        const { data, error } = await CreateSupabaseServerDBClient(token)
            .from("sections")
            .select(`*,${withLinks ? "links(*)" : ""}`)
            .order('created_at', { ascending: false })
            .eq("section_ref", email);

        if(!error && Array.isArray(data)) {
            onSuccess?.(data as SectionScheme[] | any[]);
            if(data.length == 0) { onEmpty?.(); }
            return data as unknown as SectionScheme[];
        }
        else {
            console.error("Error While Fetching Sections : [LN :: 29 >> GET_SECTIONS()] | ", error);
            onError?.(error);
            return [];
        }
    }
    catch (error) {
        console.error("Error While Fetching Sections : ");
        onError?.(error);
        return [];
    }
}