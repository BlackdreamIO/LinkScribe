import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { IDatabaseUser } from "@/interface/User";

interface IGetUser {
    token : string;
    email : string;
    onSuccess? : (user : IDatabaseUser) => void;
    onError? : (error : any) => void;
}

export async function GetDatabaseUser({ email, token, onSuccess, onError} : IGetUser) : Promise<IDatabaseUser>
{
    try
    {
        const { data, error } = await CreateSupabaseServerDBClient(token)
            .from("users")
            .select(`*`)
            .eq("user_email", email);

        if(!error) {
            onSuccess?.(data[0] as IDatabaseUser);
            return data[0] as IDatabaseUser;
        }

        onError?.(error);

        return {} as IDatabaseUser;
    }
    catch (error) {
        console.error("Error While Fetching Sections : ");
        onError?.(error);

        return {} as IDatabaseUser;
    }
}