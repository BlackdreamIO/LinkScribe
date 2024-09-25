"use client"

import { useRef, useEffect, useState } from "react";
import { useDBController } from "@/context/DBContextProvider";
import { useUser } from "@clerk/nextjs";

import { useKeyboardNavigation } from "@/hook/useKeyboardNavigation";
import { useSectionController } from "@/context/SectionControllerProviders";

import useLocalStorage from "@/hook/useLocalStorage";
import { RecursiveRemoveObjectFields } from "@/helpers/RecursiveRemoveObjectFields";

import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Brain, DatabaseZap, Network, RefreshCcwDot } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ConditionalRender } from "@/components/ui/conditionalRender";
import { useLowDiskError } from "@/hook/useLowDiskError";


const TooltipTriggerStyle = "!ring-0 rounded-full outline-8 outline-double outline-transparent focus-visible:!outline-theme-borderNavigation";

export const LinkNavbarAdditionals = () => {

    const { isSignedIn, user } = useUser();

    const [isLocalySynced, setIsLocallySynced] = useState(false);

    const { contextSections, databaseContextSections, syncStatus, Sync } = useSectionController()!;
    const { databaseExist } = useDBController();

    const lowDiskError = useLowDiskError();
    const parentRef = useRef<HTMLDivElement>(null);
    useKeyboardNavigation({ role: 'tab', parentRef : parentRef, direction : "horizontal" });

    useEffect(() => {
        const fieldsToExclude = ['created_at', 'visitCount']; // Fields to exclude
    
        const cleanedContextSections : any[] = RecursiveRemoveObjectFields(contextSections, fieldsToExclude);
        const cleanedDatabaseContextSections : any[] = RecursiveRemoveObjectFields(databaseContextSections, fieldsToExclude);

        const sortedLocalSections = cleanedContextSections.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const sortedDatabaseContextSections = cleanedDatabaseContextSections.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setIsLocallySynced(JSON.stringify(sortedLocalSections) == JSON.stringify(sortedDatabaseContextSections));
    }, [contextSections, databaseContextSections]);

    if(!user || !isSignedIn) {
        return (
            <HStack className="space-x-2">
                <Skeleton className="w-20 h-5" />
                <Skeleton className="w-20 h-5" />
                <Skeleton className="w-20 h-5" />
            </HStack>
        )
    }

    return (
        <Box className="flex flex-grow items-center justify-end pr-4 space-x-4">
            <ConditionalRender render={lowDiskError}>
                <TooltipProvider>
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger tabIndex={-1} className="text-red-500 font-bold text-end w-44 animate-fade-in-out duration-500">
                            LOW DISK
                        </TooltipTrigger>
                        <TooltipContent className="dark:bg-theme-bgThird">
                            <Text className="dark:text-white capitalize text-base">
                                Your Device Is ruuning out of disk please free up space on your primary drive to continue 
                            </Text>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </ConditionalRender>
            <HStack
                ref={parentRef}
                role="tablist"
                tabIndex={0}
                className={`space-x-4 outline-2 outline-offset-4 outline-double rounded-lg outline-transparent focus:!outline-theme-borderKeyboardParentNavigation !ring-0
                    ${lowDiskError ? "opacity-50 pointer-events-none" : ""}
            `}>

                <TooltipProvider>
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger tabIndex={-1}>
                            <Button role="tab" className={`!bg-transparent w-auto h-auto p-0 m-auto grid place-content-center ${TooltipTriggerStyle}`}>
                                <Brain className="text-[mediumspringgreen]" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="dark:bg-theme-bgSecondary">
                            <Text className="dark:text-white">
                                Generate Link With AI
                            </Text>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger tabIndex={-1}>
                            <Button role="tab" disabled={syncStatus == "Syncing"} onClick={Sync} className={`!bg-transparent w-auto h-auto p-0 m-auto grid place-content-center ${TooltipTriggerStyle}`}>
                                <RefreshCcwDot
                                    className={syncStatus == "Syncing" ? "animate-spin text-neutral-500" : syncStatus == "Synced" ? "text-theme-textSecondary" : "text-red-600"}
                                />
                            </Button>
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
                            <Network className={`${isLocalySynced ? "text-theme-primaryAccent" : "text-red-600"}`} />
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
