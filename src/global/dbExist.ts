"use client"

import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { userDBExist } from "@/app/actions/database/userDBExist";
import useLocalStorage from "@/hook/useLocalStorage";

export default function CheckDbExist()
{
    const [dbExist, setDbExist] = useState(true);

    const { isSignedIn, isLoaded, user } = useUser();

    const [_, __, getLocalStorageSectionByKey, setLocalStorageSectionByKey] = useLocalStorage('sectionsCache', []);

    const loadDB = useCallback(async () => { 
        if(isLoaded && user && user?.primaryEmailAddress) {
            const currentUserEmail = user.primaryEmailAddress.emailAddress.replaceAll("@", "").replaceAll(".", "");
            const dbExist = await userDBExist(currentUserEmail);
            setDbExist(dbExist)
            if(!dbExist)
            {
                if(getLocalStorageSectionByKey(currentUserEmail).length > 0)
                {
                    localStorage.removeItem(currentUserEmail);
                }
            }
        }
    }, [dbExist, isSignedIn, setDbExist])

    useEffect(() => {
        loadDB();
    }, [isSignedIn, isLoaded, user])
    
    return dbExist;
}