"use client";

import { useEffect, useState } from "react";
import { useWindowResize } from "@/hook/useWindowResize";
import { LinkScheme } from "@/scheme/Link";
import Image from "next/image";
import Link from "next/link";

import { Link as LinkIcon, Eye, EllipsisVertical } from "lucide-react";
import { Box, HStack, Text } from "@chakra-ui/react";

import { ConditionalRender } from "@/components/ui/conditionalRender";
import { Input } from "@/components/ui/input";
import { LinkContextMenuWrapper } from "./LinkContextMenuWrapper";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LinkUrlStatus } from "./LinkUrlStatus";
import { LinkFavIcon } from "./LinkFavIcon";
import { useLinkController } from "@/context/LinkControllerProviders";


const buttonStyle = `w-auto h-auto p-0 !bg-transparent dark:text-neutral-500 dark:hover:text-white text-black !ring-0 !border-none outline-none rounded-md focus-visible:!outline-theme-borderNavigation`;
const dropdownMenuItemStyle = `text-md py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-theme-bgThird dark:text-neutral-300 dark:hover:text-theme-textSecondary
    data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary`;

export const LinkComponent = ( { link, sectionID } : { link : LinkScheme, sectionID : string }) => {

    const { title, url, visitCount, created_at, id } = link;

    const [showContextMenuOutline, setShowContextMenuOutline] = useState(false);

    const [linkTitle, setLinkTitle] = useState(title);
    const [titleEditMode, setTitleEditMode] = useState(false);

    const [linkUrl, setLinkUrl] = useState(url);
    const [urlEditMode, setUrlEditMode] = useState(false);

    const [showMobileOptions, setShowMobileOptions] = useState(false);

    const { UpdateLink } = useLinkController()!;

    const HandleRenameTitle = () => {
        if(linkTitle.length < 6) return;
        
        setTitleEditMode(false);
        UpdateLink({
            currentLink : link,
            sectionID : sectionID,
            linkData : {
                id : link.id,
                title : linkTitle,
                url : link.url,
                visitCount : link.visitCount,
                created_at : link.created_at
            }
        })
    }
    const HandleRenameUrl = (str : string) => {
        setLinkUrl(str);
    }

    useWindowResize({
        thresholdWidth : 640, // PX
        onTriggerEnter() {
            setShowMobileOptions(true);
        },
        onTriggerOut() {
            setShowMobileOptions(false);
        },
    })

    const DropdownContents = () => {
        return (
            <>
                <DropdownMenuLabel className="text-lg">Setting</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTitleEditMode(true)} className={dropdownMenuItemStyle}>
                    Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUrlEditMode(true)} className={dropdownMenuItemStyle}>
                    Update Url
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className={`${dropdownMenuItemStyle} dark:hover:!bg-red-500 dark:hover:!text-white`}>
                Delete
                </DropdownMenuItem>
            </>
        )
    }

    return (
        <LinkContextMenuWrapper onContextMenu={setShowContextMenuOutline} onTitleRename={() => setTitleEditMode(true)} onUrlUpdate={() => setUrlEditMode(true)} onDelete={() => {}}>
            <Box className={`w-full dark:bg-theme-bgFourth flex flex-col items-center justify-center py-2 px-4 space-y-4 rounded-xl
                shadow-md shadow-black
                ${showContextMenuOutline ? "border-2 dark:border-indigo-300" : "border-[1px] dark:border-neutral-700"}`
            }>
                <HStack className="w-full" justifyContent={"space-between"}>
                    <Box className="flex flex-grow flex-row items-center justify-start">
                        <LinkFavIcon faviconUrl={linkUrl} />
                        <Input
                            value={linkTitle}
                            className={`flex flex-grow text-lg max-lg:text-base max-sm:text-xs p-2 dark:border-transparent border-2 border-transparent 
                                !ring-0 !outline-none focus-visible:!border-theme-borderNavigation disabled:opacity-100 disabled:cursor-default
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
                    <ConditionalRender render={!showMobileOptions}>
                        <Box className="w-60 max-md:w-64 flex flex-row items-center justify-end space-x-4 max-sm:hidden">
                            <Text className="text-neutral-500 max-xl:text-sm flex flex-row items-center justify-center">
                                <Eye className="mr-2" /> {visitCount}
                            </Text>
                            <Text className="dark:text-neutral-500 max-xl:text-sm">
                                {/* {new Date().toLocaleDateString()} */}
                                {new Date(created_at).toLocaleDateString()}
                            </Text>
                            <LinkUrlStatus linkUrl={linkUrl} />
                        </Box>
                    </ConditionalRender>
                </HStack>
                <HStack className="w-full" justifyContent={"space-between"}>
                    <Box className="w-full overflow-hidden flex flex-row items-center justify-start">
                        {
                            urlEditMode && (                        
                                <Input
                                    defaultValue={linkUrl}
                                    className={`flex flex-grow text-base max-lg:text-sm max-sm:text-xs p-2 dark:border-transparent border-2 border-transparent 
                                        !ring-0 !outline-none focus-visible:!border-theme-borderNavigation disabled:opacity-100 disabled:cursor-default
                                        ${urlEditMode ? "dark:bg-neutral-800 bg-neutral-200" : "!bg-transparent "} `}
                                    disabled={!urlEditMode}
                                    onChange={(e) => {
                                        if(e.target.value.length > 5) {
                                            HandleRenameUrl(e.target.value);
                                        }
                                        else {
                                            alert("Url Should Be Atleast 5 Character Long")
                                            e.preventDefault();
                                        }
                                    }}
                                    onBlur={() => setUrlEditMode(false)}
                                    onKeyDown={(e) => {
                                        if(e.key == "Enter"){ setUrlEditMode(false)};
                                    }}
                                />
                            )
                        }
                        <ConditionalRender render={!urlEditMode}>
                            <Link
                                target="_blank"
                                href={linkUrl}
                                className="text-base max-lg:text-sm max-sm:text-xs text-theme-textLink hover:text-[#a2c8f3] focus-visible:outline-theme-borderNavigation decoration-[#90c1f8] underline-offset-4 hover:underline mr-2 truncate">
                                    {linkUrl}
                            </Link>
                        </ConditionalRender>
                    </Box>
                    <ConditionalRender render={!showMobileOptions}>
                        <DropdownMenu>
                            <DropdownMenuTrigger className={buttonStyle}>
                                <EllipsisVertical className="rotate-90" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="bottom"
                                sideOffset={15}
                                align="start"
                                className="w-60 border-neutral-600 dark:bg-theme-bgFourth mr-5 space-y-2 rounded-xl p-2 shadow-lg dark:shadow-black"
                            >
                                <DropdownContents />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </ConditionalRender>
                </HStack>
                <ConditionalRender render={showMobileOptions}>
                    <HStack className="w-full" justifyContent={"space-between"}>
                        <Box className="flex flex-row items-center justify-end space-x-4">
                          <Text className="text-neutral-500 max-lg:text-sm flex flex-row items-center justify-center">
                              <Eye className="mr-2" /> 20
                          </Text>
                          <Text className="dark:text-neutral-500 max-lg:text-sm">
                              {new Date().toLocaleDateString()}
                          </Text>
                        </Box>
                        <DropdownMenu>
                            <DropdownMenuTrigger className={buttonStyle}>
                                <EllipsisVertical className="rotate-90" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="bottom"
                                sideOffset={15}
                                align="start"
                                className="w-60 border-neutral-600 dark:bg-theme-bgFourth mr-5 space-y-2 rounded-xl p-2 shadow-lg dark:shadow-black"
                            >
                                <DropdownContents />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </HStack>
                </ConditionalRender>
            </Box>
        </LinkContextMenuWrapper>
    )
}

