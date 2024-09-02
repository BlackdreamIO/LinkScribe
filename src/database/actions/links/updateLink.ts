import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { LinkScheme } from "@/scheme/Link";

interface IUpdateLink {
    token: string;
    linkData: LinkScheme;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

/**
 * Updates a link in the Supabase database.
 *
 * @param {string} token - The authentication token for accessing the Supabase database.
 * @param {Function} [onSuccess] - The callback function to be called on success.
 * @param {Function} [onError] - The callback function to be called on error.
 * @param {LinkScheme} linkData - The updated link data to be saved in the database.
 * @return {Promise<Object[]|void>} - The updated link data on success, or an empty array on error.
 */
export async function UpdateLink({ token, onSuccess, onError, linkData }: IUpdateLink) : Promise<any> {
    try {

        const database = CreateSupabaseServerDBClient(token);

        const { data, error, status, statusText } = await database.from("links")
            .update({...linkData, created_at : new Date(linkData.created_at).toDateString()})
            .eq("id", linkData.id);

        if (!error && status == 204) {
            onSuccess?.(statusText);
            return data;
        }
        else if (error || status != 204) {
            console.error("Error While Updating Link:", error);
            onError?.(error);
            return [];
        }
    }
    catch (error) {
        console.error("Error While Updating Link:", error);
        onError?.(error);
        return [];
    }
}