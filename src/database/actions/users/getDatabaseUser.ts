import { CreateSupabaseServerDBClient } from "@/database/supabase";
import { IDatabaseUser } from "@/interface/User";

interface IGetUser {
    token : string;
    email : string;
    onSuccess? : (user : IDatabaseUser) => void;
    onError? : (error : any) => void;
}

/**
 * Retrieves a user from the database based on their email and token.
 *
 * @param {IGetUser} options - An object containing the email, token, onSuccess, and onError callbacks.
 * @param {string} options.email - The email of the user to retrieve.
 * @param {string} options.token - The authentication token for accessing the database.
 * @param {function} [options.onSuccess] - A callback function to be called with the retrieved user object.
 * @param {function} [options.onError] - A callback function to be called with any error that occurs during the retrieval process.
 * @returns {Promise<IDatabaseUser>} A promise that resolves to the retrieved user object, or an empty object if an error occurs.
 */
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