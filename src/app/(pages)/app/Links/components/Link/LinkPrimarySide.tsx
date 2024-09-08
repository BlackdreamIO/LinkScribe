"use client"

import { useState, useEffect, useRef } from "react";
import { LinkLayout, LinkScheme } from "@/scheme/Link";
import { useLinkController } from "@/context/LinkControllerProviders";

import Link from "next/link";

import { Box, HStack, Text } from "@chakra-ui/react";
import { Input } from "@/components/ui/input";

import { Eye } from "lucide-react";

import { LinkFavIcon } from "./LinkFavIcon";
import { LinkUrlStatus } from "./LinkUrlStatus";
import { ConditionalRender } from "@/components/ui/conditionalRender";

type LinkPrimarySideProps = {
    link : LinkScheme;
    sectionID : string;
    showMobileOptions : boolean;
    titleEditMode : boolean;
    onTitleEditMode : (value : boolean) => void;
    layout : LinkLayout;
}

export const LinkPrimarySide = (props : LinkPrimarySideProps) => {
    
    const { link, sectionID, showMobileOptions, titleEditMode, onTitleEditMode, layout } = props;

    const [linkTitle, setLinkTitle] = useState(link.title);

    const { UpdateLink } = useLinkController()!;
    const titleRef = useRef<HTMLInputElement>(null);

    const HandleRenameTitle = () => {
        if(linkTitle.length < 3) return;
        
        onTitleEditMode(false);
        UpdateLink({
            currentLink : link,
            sectionID : sectionID,
            updatedLink : { ...link, title : linkTitle, }
        })
    }

    useEffect(() => {
        if (titleEditMode && titleRef.current) {
            const currentTimout = setTimeout(() => {
                titleRef.current?.focus();
                titleRef.current?.select();
                titleRef.current?.setSelectionRange(0, linkTitle.length);
            }, 200);
            return () => clearTimeout(currentTimout);
        }
    }, [titleEditMode]);

    return (
        <HStack className="w-full" justifyContent={"space-between"}>
            <Box className="flex flex-grow flex-row items-center justify-start">
                <LinkFavIcon faviconUrl={link.url} />
                <Input
                    tabIndex={5}
                    value={linkTitle}
                    ref={titleRef}
                    className={`flex flex-grow text-lg max-lg:text-base max-sm:text-xs p-2 dark:border-transparent border-2 border-transparent 
                        !ring-0 !outline-none focus-visible:!border-theme-borderNavigation disabled:opacity-100 disabled:cursor-default truncate
                        ${titleEditMode ? "selection:bg-teal-800" : "selection:bg-transparent"}
                        ${titleEditMode ? "dark:bg-neutral-800 bg-neutral-200" : "!bg-transparent "} `}
                    disabled={!titleEditMode}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    onBlur={() => {
                        HandleRenameTitle();
                    }}
                    onKeyDown={(e) => {
                        if(e.key == "Enter") {
                            HandleRenameTitle();
                        }
                    }}
                />
            </Box>
            <ConditionalRender render={!showMobileOptions && (layout.layout == "Grid Detailed" || layout.layout == "List Detailed")}>
                <Box className="w-60 max-md:w-64 flex flex-row items-center justify-end space-x-4 max-sm:hidden">
                    <Text className="text-neutral-500 max-xl:text-sm flex flex-row items-center justify-center">
                        <Eye className="mr-2" /> {link.visitCount}
                    </Text>
                    <Text className="dark:text-neutral-500 max-xl:text-sm">
                        {/* {new Date().toLocaleDateString()} */}
                        {new Date(link.created_at).toLocaleDateString()}
                    </Text>
                    <LinkUrlStatus linkUrl={link.url} />
                </Box>
            </ConditionalRender>
            <ConditionalRender render={(layout.layout == "Grid Compact" || layout.layout == "List Compact" || layout.layout == "Compact")}>
                <Box className={`w-auto flex flex-row items-center justify-end overflow-hidden`}>
                    <Link
                        target="_blank"
                        href={link.url}
                        onClick={() => console.log("Did Visit")}
                        className="text-sm text-end max-lg:text-xs text-theme-textLink hover:text-[#a2c8f3] focus-visible:outline-theme-borderNavigation decoration-[#90c1f8] underline-offset-4 hover:underline mr-2 truncate">
                            Visit
                    </Link>
                </Box>
            </ConditionalRender>
        </HStack>
    )
}
