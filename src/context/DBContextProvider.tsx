'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { GetDatabaseUser } from '@/database/functions/supabase/users/getDatabaseUser';
import { CreateDatabaseUser } from '@/database/functions/supabase/users/createDatabaseUser';
import { DEFAULT_APP_SETTING } from '@/lib/defaultAppSetting';

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

    const { isSignedIn, isLoaded, user } = useUser();
    const { getToken } = useAuth();

    const CheckDatabaseExist = async () => {
        setStatus(DBTaskStatus.Loading);
        const token = await getToken({ template : "linkscribe-supabase" });
        if(user && user.primaryEmailAddress && isSignedIn && token) {
            const response = await GetDatabaseUser({
                email : user.primaryEmailAddress.emailAddress,
                token : token,
                onSuccess : (user) => setDatabaseExist(user !== undefined),
                onError(error) {
                    setDatabaseExist(false);
                },
            })
            console.log(response);
            setStatus(DBTaskStatus.Loaded);
        }
    }

    const CreateUserDatabase = async () => {

        const token = await getToken({ template : "linkscribe-supabase" });
        const UniqeUserID = crypto.randomUUID().slice(0, 12);

        if(user && user.primaryEmailAddress && isSignedIn && token) {

            if(databaseExist) return;

            await CreateDatabaseUser({
                token : token,
                user : {
                    created_at : new Date(),
                    user_email : user.primaryEmailAddress.emailAddress,
                    id : UniqeUserID,
                    settings : DEFAULT_APP_SETTING,
                    subcription : "free",
                },
                onSuccess(user) {
                    console.log("user db created");
                    setDatabaseExist(true);
                },
                onError(error) {
                    console.log("user db creation failed ", error);
                },
            })
        }
    }

    useEffect(() => {
        CheckDatabaseExist();
    }, [user, isSignedIn, isLoaded]);

    useEffect(() => {
        // Function to trigger the webhook
        const triggerWebhook = async () => {
            try {
                const response = await fetch(`${window.location.origin}/api/wenbhook`, {
                    method: 'POST',
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Webhook triggered successfully:', result);
                } else {
                    console.error('Failed to trigger webhook:', response.statusText);
                }
            } catch (error) {
                console.error('Error triggering webhook:', error);
            }
        };

        // Trigger the webhook when the component mounts
        triggerWebhook();
    }, []);

    
    

    const contextValue: DBContextType = {
        status,
        setStatus,
        databaseExist,
        setDatabaseExist,

        CreateUserDatabase
    };

    return (
        <DBController.Provider value={contextValue}>
            {children}
        </DBController.Provider>
    )
}