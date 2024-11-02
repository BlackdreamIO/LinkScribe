"use server"

//import { CreateSupabaseServerDBClient } from "@/database/supabase";
//import { auth } from "@clerk/nextjs/server";
//import { revalidatePath } from "next/cache";

interface IUploadLinkPreviewImage {
    id : string;
    email : string;
    file : File | Blob | string;
}

interface IOutput {
    data? : {
        id : string;
        path : string;
        fullPath : string;
    }
    error : null | any;
    hasError : boolean;
}

export async function UploadLinkPreviewImage({ email, file, id } : IUploadLinkPreviewImage) : Promise<any> {
    try
    {
        //console.log(email, file, id);

        //const { getToken } = auth();
        //const accessToken = await getToken({ template : "linkscribe-supabase" });

        /*
        if(!accessToken) {
            return {
                error : true,
                hasError : true
            }
        }

        const { data, error } = await CreateSupabaseServerDBClient(accessToken).storage
            .from("media-bucket")
            .upload(`${email}/links/${id}`, file, { upsert : true });
        
        if(!error) {
            return {
                data : data,
                error : null,
                hasError : false
            }
        }
        revalidatePath(`/links`);
        */
       console.log("accessToken")
        // return {
        //     error : "accessToken",
        //     hasError : true
        // }
    }
    catch (error : any) {
        console.log(error);
        // return {
        //     error: error.message || "An unexpected error occurred",
        //     hasError: true,
        // };
    }
}