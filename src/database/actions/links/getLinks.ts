import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { LinkScheme } from "@/scheme/Link";

interface IGetLinks {
    token : string;
    email : string;

    onSuccess? : (sections : LinkScheme[]) => void;
    onEmpty? : () => void;
    onError? : (error : any) => void;
}

export async function GetLinks({ email, token, onSuccess, onError, onEmpty } : IGetLinks) : Promise<LinkScheme[]>
{
    try
    {
        const { data, error } = await CreateSupabaseServerDBClient(token)
            .from("links")
            .select(`*`)
            .eq("ref", email);

        if(!error && Array.isArray(data)) {
            onSuccess?.(data as LinkScheme[] | any[]);
            if(data.length == 0) { onEmpty?.(); }
            return data as unknown as LinkScheme[];
        }
        else {
            console.error("Error While Fetching Links : [LN :: 29 >> GET_LINKS()] | ", error);
            onError?.(error);
            return [];
        }
    }
    catch (error) {
        console.error("Error While Fetching Links : ");
        onError?.(error);
        return [];
    }
}