"use client";

import { useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Box, Text, VStack } from "@chakra-ui/react"
import { LayoutGrid, Rows3, Search, Settings } from 'lucide-react';
import { useKeyboardNavigation } from "@/hook/useKeyboardNavigation";


export const ListItems = ({ minimizeMode } : { minimizeMode : boolean }) => {

    const parentRef = useRef<HTMLDivElement>(null);
    useKeyboardNavigation({ role: 'tab', parentRef : parentRef, direction : "vertical" });

    const router = useRouter();
    const pathName = usePathname();
    
    const handleChangeRoute = (route : string) => {
        router.push(route);
    }

    const Item = ({ icon, label, onClick } : { icon : any, label : string, onClick : (e? : any) => void; }) => {
        return (
            <Button 
                role="tab"
                tabIndex={0}
                variant={"ghost"} 
                className={`w-full flex flex-row items-center gap-4 px-4 h-14 rounded-lg !ring-0 focus-visible:!outline-theme-borderNavigation cursor-default
                    ${ minimizeMode ? "h-10" : "h-14"}
                    ${ minimizeMode ? "justify-center" : "justify-start"}
                    ${pathName.includes(label) ? "dark:bg-theme-bgThird/20 bg-neutral-100 dark:border-neutral-800 border border-neutral-300" : "dark:hover:bg-theme-bgThird/40"}`}
                
                onClick={onClick}
            >
                <div className="text-theme-textSecondary">
                    {icon}
                </div>
                {
                    !minimizeMode && (
                        <Text>{label}</Text>
                    )
                }
            </Button>
        )
    }

    return (
        <Box className="w-full">
            <VStack ref={parentRef} className="space-y-2 !outline-none border-2 !border-transparent focus:!border-theme-borderKeyboardParentNavigation rounded-xl" role="tablist" tabIndex={0}>
                <Item 
                    icon={<Search />}
                    label="Search"
                    onClick={() => handleChangeRoute("/app/Search")}
                />
                <Item 
                    icon={<LayoutGrid />}
                    label="Overview"
                    onClick={() => handleChangeRoute("/app/Overview")}
                />
                <Item 
                    icon={<Rows3 />}
                    label="Links"
                    onClick={() => handleChangeRoute("/app/Links")}
                />
                <Item 
                    icon={<Settings />}
                    label="Settings"
                    onClick={() => handleChangeRoute("/app/Settings")}
                />
            </VStack>
        </Box>
    )
}
