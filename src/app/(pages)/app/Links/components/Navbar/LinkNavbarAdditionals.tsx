"use client"

import { useRef, useEffect, useState } from "react";

import { useKeyboardNavigation } from "@/hook/useKeyboardNavigation";
import { useSectionController } from "@/context/SectionControllerProviders";
import { useDBController } from "@/context/DBContextProvider";
import { useLowDiskError } from "@/hook/useLowDiskError";
import { useUser } from "@clerk/nextjs";
import useLocalStorage from "@/hook/useLocalStorage";

import { RecursiveRemoveObjectFields } from "@/helpers/RecursiveRemoveObjectFields";
import { SectionScheme } from "@/scheme/Section";

import { Box, HStack, Text } from "@chakra-ui/react";
import { AudioLines, DatabaseZap, Network, RefreshCcwDot } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HoverCard, HoverCardContent, HoverCardTrigger, } from "@/components/ui/hover-card";
  
import { ConditionalRender } from "@/components/ui/conditionalRender";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DialogContentStyle, DialogFooterButtonStyle } from "@/styles/componentStyles";
import { AiGenerationDialog } from "../../../components/AIGeneration/AiGenerationDialog";
import { AGContextWrapper } from "../../../components/AIGeneration/AGContextWrapper";

const TooltipTriggerStyle = "!ring-0 rounded-full outline-4 outline outline-transparent focus-visible:!outline-theme-borderNavigation";

export const LinkNavbarAdditionals = () => {

    const { isSignedIn, isLoaded, user } = useUser();
    const [isLocalySynced, setIsLocallySynced] = useState(false);

    //const { contextSections, databaseContextSections, syncStatus, Sync } = useSectionController()!;
    const { databaseExist } = useDBController();
    const [_, __, getLocalStorageSectionByKey, ___] = useLocalStorage<SectionScheme[]>('sectionsCache', []);

    const lowDiskError = useLowDiskError();
    const parentRef = useRef<HTMLDivElement>(null);
    useKeyboardNavigation({ role: 'tab', parentRef : parentRef, direction : "horizontal" });


    /*
    useEffect(() => {
        const fieldsToExclude = ['created_at', 'visitCount']; // Fields to exclude
    
        const cleanedContextSections : any[] = RecursiveRemoveObjectFields(contextSections, fieldsToExclude);
        const cleanedDatabaseContextSections : any[] = RecursiveRemoveObjectFields(databaseContextSections, fieldsToExclude);

        const sortedLocalSections = cleanedContextSections.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const sortedDatabaseContextSections = cleanedDatabaseContextSections.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setIsLocallySynced(JSON.stringify(sortedLocalSections) == JSON.stringify(sortedDatabaseContextSections) || sortedLocalSections.length == sortedDatabaseContextSections.length);
    }, [contextSections, databaseContextSections]);
    */

    return (
        <Box className="flex flex-grow items-center justify-end pr-4">
            <ConditionalRender render={!isSignedIn && !isLoaded}>
                <HStack className="space-x-2">
                    <Skeleton className="w-20 h-5" />
                    <Skeleton className="w-20 h-5" />
                    <Skeleton className="w-20 h-5" />
                </HStack>
            </ConditionalRender>
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
            <HStack ref={parentRef} role="tablist" tabIndex={0} className={`${lowDiskError || !isSignedIn ? "!hidden" : ""} space-x-4 outline-2 outline-offset-4 outline-double rounded-lg outline-transparent focus:!outline-theme-borderKeyboardParentNavigation !ring-0`}>
                <AGContextWrapper>
                    <AiGenerationDialog/>
                </AGContextWrapper>
                <TooltipProvider>
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger tabIndex={-1}>
                            <Button
                                role="tab"
                                tabIndex={lowDiskError ? -1 : 0}
                                //disabled={syncStatus == "Syncing"}
                                //onClick={Sync}
                                className={`!bg-transparent w-auto h-auto p-0 m-auto grid place-content-center ${TooltipTriggerStyle}`}
                            >
                                {/* <RefreshCcwDot
                                    className={syncStatus == "Syncing" ? "animate-spin text-neutral-500" : syncStatus == "Synced" ? "text-theme-textSecondary" : "text-red-600"}
                                /> */}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="dark:bg-theme-bgSecondary">
                            {/* <Text className="dark:text-white">
                                {syncStatus}
                            </Text> */}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <HoverCard openDelay={200} closeDelay={200}>
                    <HoverCardTrigger role="tab" tabIndex={0} className={TooltipTriggerStyle}>
                        <Network className={`${isLocalySynced ? "text-green-500" : "text-red-600"}`} />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto border border-neutral-600 mt-5 mr-10 space-y-2">
                        <Text className="dark:text-white">
                            {isLocalySynced ? "Synced" : "Not Synced"}
                        </Text>
                        <Separator/>
                        <Box className="w-full flex flex-row items-center justify-between space-x-2">
                            <Text className="dark:text-black px-4 py-1 dark:bg-neutral-300 rounded-xl">
                                {/* {`Local : ${contextSections.length}`} */}
                            </Text>
                            <Text className="dark:text-black px-4 py-1 dark:bg-neutral-300 rounded-xl">
                                {/* {`Server : ${databaseContextSections.length}`} */}
                            </Text>
                        </Box>
                        <Separator/>
                        <Box className="w-full flex flex-col items-center justify-between space-y-2">
                            <Text className="dark:text-green-500 text-xs px-4 py-1 dark:bg-black rounded-xl">
                                {
                                    // contextSections && contextSections[0] ? `${contextSections[0].id.slice(0, 4)}/${new Date(contextSections[0].created_at).toISOString()}` : "NULL"
                                }
                            </Text>
                            <Text className="dark:text-green-500 text-xs px-4 py-1 dark:bg-black rounded-xl">
                            {
                                // databaseContextSections && databaseContextSections[0] ? `${databaseContextSections[0].id.slice(0, 4)}/${new Date(databaseContextSections[0].created_at).toISOString()}` : "NULL"
                            }
                            </Text>
                        </Box>
                    </HoverCardContent>
                </HoverCard>
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