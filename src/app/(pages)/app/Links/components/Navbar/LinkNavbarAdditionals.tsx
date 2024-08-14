"use client"

import { useRef, useEffect, useState } from "react";

import { useKeyboardNavigation } from "@/hook/useKeyboardNavigation";
import { useSectionController } from "@/context/SectionControllerProviders";

import useLocalStorage from "@/hook/useLocalStorage";

import { useUser } from "@clerk/nextjs";
import { SectionScheme } from "@/scheme/Section";

import { ConvertEmailString } from "@/global/convertEmailString";

import { Box, HStack, Text } from "@chakra-ui/react";
import { DatabaseZap, Network, RefreshCcwDot } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDBController } from "@/context/DBContextProvider";


const TooltipTriggerStyle = "!ring-0 rounded-full outline-8 outline-double outline-transparent focus:!outline-theme-borderNavigation";

export const LinkNavbarAdditionals = () => {

    const [localStorageSections, setLocalStorageSections] = useState<SectionScheme[]>([]);
    const [localStorageSynced, setLocalStorageSynced] = useState(false);

    const { isSignedIn, isLoaded, user } = useUser();

    const { contextSections, syncStatus, Sync } = useSectionController()!;
    const { databaseExist } = useDBController();
    const [_, __, getLocalStorageSectionByKey, ___] = useLocalStorage<SectionScheme[]>('sectionsCache', []);

    const parentRef = useRef<HTMLDivElement>(null);
    useKeyboardNavigation({ role: 'tab', parentRef : parentRef, direction : "horizontal" });

    useEffect(() => {
        const handleStorageChange = (event : StorageEvent) => {
            console.log("Storage changed");
            if (user && isSignedIn && isLoaded && user.primaryEmailAddress) {
                const currentUserEmail = ConvertEmailString(user.primaryEmailAddress.emailAddress);
    
                if (event.key === currentUserEmail) {
                    console.log("Checking local storage for user data");
                    const data = getLocalStorageSectionByKey(currentUserEmail);
    
                    if (contextSections.length === data.length) {
                        setLocalStorageSynced(true);
                        console.log("Local storage synced with context sections");
                    } else {
                        setLocalStorageSynced(false);
                        console.log("Local storage not synced with context sections");
                    }
                }
            }
        };
    
        window.addEventListener('storage', handleStorageChange);
    
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [user, isSignedIn, isLoaded, user?.primaryEmailAddress, contextSections]);
    
    

    useEffect(() => {
        if(user && isSignedIn && isLoaded && user.primaryEmailAddress) {
            const currentUserEmail = ConvertEmailString(user.primaryEmailAddress.emailAddress);
            const data = getLocalStorageSectionByKey(currentUserEmail);
            setLocalStorageSections(data);
        }
    }, [contextSections, user, isSignedIn, isLoaded]);
    
    useEffect(() => {
        if(user && isSignedIn && isLoaded && user.primaryEmailAddress) {
            const currentUserEmail = ConvertEmailString(user.primaryEmailAddress.emailAddress);
            const data = getLocalStorageSectionByKey(currentUserEmail);
            if(contextSections.length == data.length) {
                setLocalStorageSynced(true);
            }
            else {
                setLocalStorageSynced(false);
            }
        }
    }, [user, isSignedIn, isLoaded, contextSections, localStorageSections])


    return (
        <Box className="flex flex-grow items-center justify-end pr-4">
            <HStack ref={parentRef} role="tablist" tabIndex={0} className="space-x-4 outline-2 outline-offset-4 outline-double rounded-lg outline-transparent focus:!outline-theme-borderKeyboardParentNavigation !ring-0">
                <TooltipProvider>
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger role="tab" className={TooltipTriggerStyle}>
                            <RefreshCcwDot
                                className={syncStatus == "Syncing" ? "animate-spin text-neutral-500" : syncStatus == "Synced" ? "text-theme-textSecondary" : "text-red-600"}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="dark:bg-theme-bgSecondary">
                            <Text className="dark:text-white">
                                {syncStatus}
                            </Text>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger role="tab" className={TooltipTriggerStyle}>
                            <Network className={`${localStorageSynced ? "text-green-500" : "text-red-600"}`} />
                        </TooltipTrigger>
                        <TooltipContent className="dark:bg-theme-bgSecondary">
                            <Text className="dark:text-white">
                                Local Store Status
                            </Text>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger role="tab" className={TooltipTriggerStyle}>
                            <DatabaseZap className={`${databaseExist ? "text-theme-primaryAccent" : "text-red-600"}`} />
                        </TooltipTrigger>
                        <TooltipContent className="dark:bg-theme-bgSecondary">
                            <Text className="dark:text-white">
                                Database Connection
                            </Text>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </HStack>
        </Box>
    )
}
