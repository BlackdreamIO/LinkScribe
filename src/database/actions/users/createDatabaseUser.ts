import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { RefineEmail } from "@/helpers";
import { IDatabaseUser } from "@/interface/User";

interface ICreateUser {
    token : string;
    user : IDatabaseUser;
    onSuccess? : (data : any) => void;
    onError? : (error : any) => void;
}

/**
 * Creates a new database user with the provided user data and token.
 *
 * @param {ICreateUser} params - An object containing the user data, token, and callback functions.
 * @param {string} params.token - The authentication token for the database client.
 * @param {IDatabaseUser} params.user - The user data to be inserted into the database.
 * @param {(data: any) => void} [params.onSuccess] - An optional callback function to be executed on successful user creation.
 * @param {(error: any) => void} [params.onError] - An optional callback function to be executed on error.
 * @return {Promise<void>}
 */
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