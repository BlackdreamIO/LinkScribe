'use client'

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { GetDatabaseUser } from '@/database/actions/users/getDatabaseUser';
import { CreateDatabaseUser } from '@/database/actions/users/createDatabaseUser';
import { DEFAULT_APP_SETTING } from '@/utils/defaultAppSetting';
import { RefineEmail } from '@/helpers';

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

interface UseDBControllerResult {
    status: DBTaskStatus;
    setStatus: React.Dispatch<React.SetStateAction<DBTaskStatus>>;
    databaseExist: boolean;
    isLoading: boolean;
    CreateUserDatabase: () => Promise<void>;
}

export function useDB(): UseDBControllerResult {
    const [status, setStatus] = useState<DBTaskStatus>(DBTaskStatus.NoTask);
    const [databaseExist, setDatabaseExist] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { isSignedIn, isLoaded, user } = useUser();
    const { getToken } = useAuth();

    const CheckDatabaseExist = async () => {
        const token = await getToken({ template: "linkscribe-supabase" });
        if (user && user.primaryEmailAddress && isSignedIn && token) {
            setIsLoading(true);
            await GetDatabaseUser({
                email: RefineEmail(user.primaryEmailAddress.emailAddress),
                token: token,
                onSuccess: (user) => setDatabaseExist(user !== undefined),
                onError: () => setDatabaseExist(false),
            });
            setIsLoading(false);
        }
    };

    const CreateUserDatabase = async () => {
        const token = await getToken({ template: "linkscribe-supabase" });
        const uniqueUserID = crypto.randomUUID().slice(0, 12);

        if (user && user.primaryEmailAddress && isSignedIn && token) {
            if (databaseExist) return;
            setIsLoading(true);
            setStatus(DBTaskStatus.CreatingCollection);

            await CreateDatabaseUser({
                token: token,
                user: {
                    created_at: new Date(),
                    user_email: RefineEmail(user.primaryEmailAddress.emailAddress),
                    id: uniqueUserID,
                    settings: DEFAULT_APP_SETTING,
                    subcription: "free",
                },
                onSuccess: () => {
                    setDatabaseExist(true);
                    setIsLoading(false);
                    setStatus(DBTaskStatus.CreatedCollection);
                },
                onError: (error) => {
                    console.error("User DB creation failed:", error);
                    setIsLoading(false);
                    setDatabaseExist(false);
                    setStatus(DBTaskStatus.FailedCreateCollection);
                },
            });
        }
    };

    useEffect(() => {
        CheckDatabaseExist();
    }, [user, isSignedIn, isLoaded]);

    return {
        status,
        setStatus,
        databaseExist,
        isLoading,
        CreateUserDatabase,
    };
}
