"use client"

import { useKeyboardNavigationContext } from "@/context/KeyboardNavigationContext";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Box, HStack, Text } from "@chakra-ui/react";
import { DatabaseZap, Network, RefreshCcwDot } from "lucide-react";

export const LinkNavbarAdditionals = () => {

    const { handleKeyDown } = useKeyboardNavigationContext()!;

    return (
        <Box className="flex flex-grow items-center justify-end pr-4">
            <HStack className="space-x-4 border-2 !border-transparent focus:!border-theme-borderNavigation !ring-0 !outline-none" role="tablist" onKeyDown={handleKeyDown} tabIndex={0}>
                <TooltipProvider>
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger role="tab" className="!ring-0 border-2 !border-transparent focus:!border-theme-borderNavigation !outline-none">
                            <RefreshCcwDot />
                        </TooltipTrigger>
                        <TooltipContent className="dark:bg-theme-bgSecondary">
                            <Text className="dark:text-white">
                                Synced
                            </Text>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger role="tab" className="!ring-0 border-2 !border-transparent focus:!border-theme-borderNavigation !outline-none">
                            <Network />
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
                        <TooltipTrigger role="tab" className="!ring-0 border-2 !border-transparent focus:!border-theme-borderNavigation !outline-none">
                            <DatabaseZap />
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
