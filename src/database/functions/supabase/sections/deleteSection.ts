import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { SectionScheme } from "@/scheme/Section";

interface IGetSections {
    token : string;
    section_id : string;
    onSuccess? : (data : any) => void;
    onError? : (error : any) => void;
}

export async function DeleteSection({ token, onSuccess, onError, section_id} : IGetSections)
{
    try
    {
        const { data, error, status } = await CreateSupabaseServerDBClient(token)
            .from("sections")
            .delete()
            .eq('id', section_id)

        if(!error && status == 200) {
            onSuccess?.(data);
            return data;
        }
        else if(error) {
            console.error("Error While Deleting Section : [LN :: 27 >> DELETE_SECTIONS()] | ", error);
            onError?.(error);
            return [];
        }
    }
    catch (error) {
        console.error("Error While Deleting Section : ");
        onError?.(error);
        return [];
    }
}