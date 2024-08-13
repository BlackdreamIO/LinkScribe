import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { LinkScheme } from "@/scheme/Link";

interface ICreateLink {
    token : string;
    linkData? : LinkScheme;
    bulkData? : Object[];
    useBulkInsert? : boolean;
    onSuccess? : (data : any) => void;
    onError? : (error : any) => void;
}

/**
 * Creates a new link in the "links" table of the Supabase database.
 *
 * @param {Object} options - The options for creating the link.
 * @param {string} options.token - The token for authentication.
 * @param {Function} [options.onSuccess] - The callback function to be called on success.
 * @param {Function} [options.onError] - The callback function to be called on error.
 * @param {LinkScheme} options.linkData - The data of the link to be created.
 * @return {Promise<Object[]|void>} - The created link data on success, or an empty array on error.
 */
export async function CreateLink({ token, onSuccess, onError, linkData, useBulkInsert, bulkData } : ICreateLink)
{
    try
    {
        if(!linkData && !bulkData) {
            onError?.("Error While Creating Link : [LN :: 28 >> CREATE_LINK()] | No data provided");
            return;
        };
        if(useBulkInsert && !bulkData) {
            onError?.("Error While Creating Link : [LN :: 32 >> CREATE_LINK()] | No bulk data provided");
            return;
        };
        if(!useBulkInsert && !linkData) {
            onError?.("Error While Creating Link : [LN :: 36 >> CREATE_LINK()] | No link data provided");
            return;
        };
        
        const dataToInsert = useBulkInsert ? bulkData : linkData && {
            id : linkData.id,
            title : linkData.title,
            url : linkData.url,
            ref : linkData.ref,
            created_at : new Date(linkData.created_at).toISOString(),
        }

        const { data, error, status, statusText } = await CreateSupabaseServerDBClient(token).from("links").insert(dataToInsert);

        if(!error && status == 201) {
            onSuccess?.(statusText);
            return data;
        }
        else if(error || status != 201) {
            console.error("Error While Creating Link : [LN :: 28 >> CREATE_LINK()] | ", error);
            onError?.(statusText);
            return [];
        }
    }
    catch (error) {
        console.error("Error While Creating Link : ", error);
        onError?.(error);
        return [];
    }
}