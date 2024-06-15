"use client"

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { userDBExist } from "@/app/actions/database/userDBExist";

export default function CheckDbExist()
{

    const [dbExist, setDbExist] = useState(false);
    const { isSignedIn, isLoaded, user } = useUser();

    const loadDB = async () => {
        if(isLoaded && user && user?.primaryEmailAddress) {
            const currentUserEmail = user.primaryEmailAddress.emailAddress.replaceAll("@", "").replaceAll(".", "");
            const dbExist = await userDBExist(currentUserEmail);
            setDbExist(dbExist)
        }
    }

    useEffect(() => {
        loadDB();
    }, [isSignedIn, isLoaded])
    
    return dbExist;
}