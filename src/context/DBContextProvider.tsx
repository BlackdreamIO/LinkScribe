'use client'

import { createCollection } from '@/app/actions/database/createCollection';
import { userDBExist } from '@/app/actions/database/userDBExist';
import { ConvertEmailString } from '@/global/convertEmailString';
import CheckDbExist from '@/global/dbExist';
import { useUser } from '@clerk/nextjs';
import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';

export const dynamic = 'force-dynamic';

export enum DBTaskStatus {
    NoTask = "no-task",
    CreatingCollection = "creating-collection",
    CreatedCollection = "created-collection",
    DeletingCollection = "deleting-collection",
    FailedCreateCollection = "failed-create-collection",
    FailedDeleteCollection = "failed-delete-collection",
  }

export interface DBContextType{

    status : DBTaskStatus;
    setStatus: Dispatch<SetStateAction<DBTaskStatus>>;

    databaseExist : boolean;
    setDatabaseExist: Dispatch<SetStateAction<boolean>>;

    CreateCollection: () => Promise<void>;
    GetCollections: (revalidateFetch? : boolean) => Promise<any[]>;
    DeleteCollection: (id: string) => Promise<any>;
}

type DBContextProviderProps = {
    children : ReactNode;
}

const DBController = createContext<DBContextType | undefined>(undefined);

export const useDBController = () => useContext(DBController);

export const DBContextProvider = ({children} : DBContextProviderProps) => {

    const [status, setStatus] = useState<DBTaskStatus>(DBTaskStatus.NoTask);

    const [databaseExist, setDatabaseExist] = useState(true);

    const { isSignedIn, isLoaded, user } = useUser();

    const CreateCollection = async () => {
        if(user && isSignedIn && isLoaded) 
        {
            if(user.primaryEmailAddress) 
            {
                const currentUserEmail = user.primaryEmailAddress.emailAddress.replaceAll("@", "").replaceAll(".", "");
                setStatus(DBTaskStatus.CreatingCollection);
                await createCollection(currentUserEmail)
                    .then((rs) => {
                        if(rs == "CREATED") {
                            setStatus(DBTaskStatus.CreatedCollection);   
                        }
                        else if (rs == "ALREADY EXIST") {
                            setStatus(DBTaskStatus.FailedCreateCollection);
                        }
                    })
                    .catch((err) => {
                        setStatus(DBTaskStatus.FailedCreateCollection);
                    })
            }
        }
    }

    const GetCollections = async () => {
        return [];
    }
    
    const DeleteCollection = async () => {
        return [];
    }

    const DBExist = async () => {
        if(user && isSignedIn && user.primaryEmailAddress?.emailAddress) {
            const existence = await userDBExist(ConvertEmailString(user.primaryEmailAddress.emailAddress));

            setTimeout(() => {
                setDatabaseExist(existence);
            }, 200);
        }
        else {
            setDatabaseExist(false);
        }
    }

    useEffect(() => {
        if(user && isSignedIn && isLoaded) {
            DBExist();
        }
    }, [user, isLoaded, isSignedIn])
    
    useEffect(() => {
        console.log(databaseExist, " ya it kinda");
        
    }, [databaseExist])
    

    const contextValue: DBContextType = {
        status,
        setStatus,
        CreateCollection,
        GetCollections,
        DeleteCollection,
        databaseExist,
        setDatabaseExist
    };

    return (
        <DBController.Provider value={contextValue}>
            {children}
        </DBController.Provider>
    )
}