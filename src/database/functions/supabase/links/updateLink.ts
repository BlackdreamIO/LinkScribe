import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { LinkScheme } from "@/scheme/Link";

interface IUpdateLink {
    token: string;
    updatedLink: LinkScheme;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

export async function UpdateLink({ token, onSuccess, onError, updatedLink }: IUpdateLink) {
    try {
        const { data, error, status, statusText } = await CreateSupabaseServerDBClient(token).from("links")
            .update(updatedLink)
            .eq("id", updatedLink.id);

        console.log(data);

        if (!error && status == 204) {
            onSuccess?.(statusText);
            return data;
        }
        else if (error || status != 204) {
            console.error("Error While Updating Link:", error);
            onError?.(statusText);
            return [];
        }
    }
    catch (error) {
        console.error("Error While Updating Link:", error);
        onError?.(error);
        return [];
    }
}
