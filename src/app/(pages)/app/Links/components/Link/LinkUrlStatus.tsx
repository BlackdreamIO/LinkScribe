"use client"

import { useCallback, useEffect, useState } from "react";
import { URLStatus } from "@/global/checkUrlValidity";

import { Text } from "@chakra-ui/react";
import { BadgeCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const LinkUrlStatus = ( { linkUrl } : { linkUrl : string }) => {

    const [urlStatus, setUrlStatus] = useState<URLStatus>();

    const GetURLStatus = useCallback(async () => {
        const url = linkUrl;
        const status = await fetch(`${window.location.origin}/api/checkUrl?url=${url}`, {
            method : "POST",
        });
        
        const statusJSON : URLStatus = await status.json();

        switch (statusJSON) {
            case URLStatus.Valid:
                setUrlStatus(URLStatus.Valid);
                break;
            case URLStatus.Invalid:
                setUrlStatus(URLStatus.Invalid);
                break
            case URLStatus.NetworkIssue:
                setUrlStatus(URLStatus.NetworkIssue);
                break
            case URLStatus.Unknown:
                setUrlStatus(URLStatus.Unknown);
                break
            default:
                break;
        }
    }, [linkUrl])

    useEffect(() => {
        GetURLStatus();
    }, [linkUrl, GetURLStatus])
    
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Text className="max-xl:text-sm flex flex-row items-center justify-center">
                        <BadgeCheck className={`${
                            urlStatus == URLStatus.Valid ? "text-green-500" : 
                            URLStatus.Invalid ? "text-red-500" : 
                            URLStatus.NetworkIssue ? "text-amber-400" : 
                            URLStatus.Unknown ? "text-orange-400" : "text-orange-400"}`
                        } 
                        />
                    </Text>
                </TooltipTrigger>
                <TooltipContent align="end" className="dark:bg-theme-bgSecondary">
                    <Text className="dark:text-white">Valid</Text>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
