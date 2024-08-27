'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { GetDatabaseUser } from '@/database/actions/users/getDatabaseUser';
import { CreateDatabaseUser } from '@/database/actions/users/createDatabaseUser';
import { DEFAULT_APP_SETTING } from '@/utils/defaultAppSetting';
import { RefineEmail } from '@/helpers/index';

export const dynamic = 'force-dynamic';

export enum DBTaskStatus {
    NoTask = "no-task",
    CreatingCollection = "creating-collection",
    CreatedCollection = "created-collection",
    DeletingCollection = "deleting-collection",
    FailedCreateCollection = "failed-create-collection",
    FailedDeleteCollection = "failed-delete-collection",
    Loading = "loading",
    Loaded = "loaded",
}

export interface DBContextType{

    status : DBTaskStatus;
    setStatus: Dispatch<SetStateAction<DBTaskStatus>>;

    databaseExist : boolean;
    setDatabaseExist: Dispatch<SetStateAction<boolean>>;

    isLoading : boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;

    CreateUserDatabase : () => Promise<void>;
}

type DBContextProviderProps = {
    children : ReactNode;
}

const DBController = createContext<DBContextType | undefined>(undefined);

export const useDBController = () => useContext(DBController)!;

export const DBContextProvider = ({children} : DBContextProviderProps) => {

    const [status, setStatus] = useState<DBTaskStatus>(DBTaskStatus.NoTask);

    const [databaseExist, setDatabaseExist] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { isSignedIn, isLoaded, user } = useUser();
    const { getToken } = useAuth();

    const CheckDatabaseExist = async () => {
        const token = await getToken({ template : "linkscribe-supabase" });
        if(user && user.primaryEmailAddress && isSignedIn && token) {
            setIsLoading(true);
            const response = await GetDatabaseUser({
                email : RefineEmail(user.primaryEmailAddress.emailAddress),
                token : token,
                onSuccess : (user) => setDatabaseExist(user !== undefined),
                onError(error) {
                    setDatabaseExist(false);
                },
            })
            setIsLoading(false);
        }
    }

    const CreateUserDatabase = async () => {

        const token = await getToken({ template : "linkscribe-supabase" });
        const UniqeUserID = crypto.randomUUID().slice(0, 12);

        if(user && user.primaryEmailAddress && isSignedIn && token) {

            if(databaseExist) return;
            setIsLoading(true);
            setStatus(DBTaskStatus.CreatingCollection);
            await CreateDatabaseUser({
                token : token,
                user : {
                    created_at : new Date(),
                    user_email : RefineEmail(user.primaryEmailAddress.emailAddress),
                    id : UniqeUserID,
                    settings : DEFAULT_APP_SETTING,
                    subcription : "free",
                },
                onSuccess(user) {
                    console.log("user db created");
                    setDatabaseExist(true);
                    setIsLoading(false);
                    setStatus(DBTaskStatus.CreatedCollection);
                },
                onError(error) {
                    console.log("user db creation failed ", error);
                    setIsLoading(false);
                    setDatabaseExist(false);
                    setStatus(DBTaskStatus.FailedCreateCollection);
                },
            })
        }
    }

    useEffect(() => {
        CheckDatabaseExist();
    }, [user, isSignedIn, isLoaded]);


    const contextValue: DBContextType = {
        status,
        setStatus,
        databaseExist,
        setDatabaseExist,
        isLoading,
        setIsLoading,

        CreateUserDatabase
    };

    return (
        <DBController.Provider value={contextValue}>
            {children}
        </DBController.Provider>
    )
}