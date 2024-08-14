import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { RefineEmail } from "@/helpers/NormalizeEmail";
import { IDatabaseUser } from "@/interface/User";

interface ICreateUser {
    token : string;
    user : IDatabaseUser;
    onSuccess? : (data : any) => void;
    onError? : (error : any) => void;
}

export async function CreateDatabaseUser({ user, token, onSuccess, onError} : ICreateUser)
{
    try
    {
        const { error, statusText } = await CreateSupabaseServerDBClient(token)
            .from("users")
            .insert(user);

        if(!error) {
            onSuccess?.(statusText);
        }
        else if(error) {
            onError?.(error);
        }
    }
    catch (error) {
        console.error("Error While Creating Database User : ");
        onError?.(error);
    }
}