import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { LinkScheme } from "@/scheme/Link";

interface IDeleteLink {
    token : string;
    linkData : LinkScheme;
    onSuccess? : (data : any) => void;
    onError? : (error : any) => void;
}

export async function DeleteLink({ token, onSuccess, onError, linkData} : IDeleteLink)
{
    try
    {
        const { data, error, status, statusText } = await CreateSupabaseServerDBClient(token).from("links")
            .delete()
            .eq('id', linkData.id);
        
        if(!error && status == 204) {
            onSuccess?.(statusText);
            return data;
        }
        else if(error || status != 204) {
            console.error("Error While Deleting Link : [LN :: 24 >> DELETE_LINK()] | ", error);
            onError?.(statusText);
            return [];
        }
    }
    catch (error) {
        console.error("Error While Deleting Link : ", error);
        onError?.(error);
        return [];
    }
}