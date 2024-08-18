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
import { Button } from "@/components/ui/button";


const TooltipTriggerStyle = "!ring-0 rounded-full outline-8 outline-double outline-transparent focus-visible:!outline-theme-borderNavigation";

export const LinkNavbarAdditionals = () => {

    const { isSignedIn, isLoaded, user } = useUser();

    const { contextSections, syncStatus, Sync } = useSectionController()!;
    const { databaseExist } = useDBController();
    const [_, __, getLocalStorageSectionByKey, ___] = useLocalStorage<SectionScheme[]>('sectionsCache', []);

    const parentRef = useRef<HTMLDivElement>(null);
    useKeyboardNavigation({ role: 'tab', parentRef : parentRef, direction : "horizontal" });


    return (
        <Box className="flex flex-grow items-center justify-end pr-4">
            <HStack ref={parentRef} role="tablist" tabIndex={0} className="space-x-4 outline-2 outline-offset-4 outline-double rounded-lg outline-transparent focus:!outline-theme-borderKeyboardParentNavigation !ring-0">
                
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
                            <Network className={`${true ? "text-green-500" : "text-red-600"}`} />
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
