"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, HStack, Text } from "@chakra-ui/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link as LinkIcon, Eye, EllipsisVertical } from "lucide-react";
import { useWindowResize } from "@/hook/useWindowResize";
import { Input } from "@/components/ui/input";
import { LinkContextMenuWrapper } from "./LinkContextMenuWrapper";
import Image from "next/image";

const buttonStyle = `w-auto h-auto p-0 !bg-transparent dark:text-neutral-500 dark:hover:text-white text-black !ring-0 !border-none outline-none rounded-md focus-visible:!outline-theme-borderNavigation`;
const dropdownMenuItemStyle = `text-md py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-theme-bgThird dark:text-neutral-300 dark:hover:text-theme-textSecondary
    data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary`;

export const LinkComponent = () => {

    const [faviconUrl, setFaviconUrl] = useState('');
    const [showContextMenuOutline, setShowContextMenuOutline] = useState(false);

    const [linkTitle, setLinkTitle] = useState("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non molestias quas, quos accusamus optio commodi debitis ducimus recusandae vitae.");
    const [titleEditMode, setTitleEditMode] = useState(false);

    const [linkUrl, setLinkUrl] = useState(" https://github.com/BlackdreamIO/Fullstack-Todo-App/blob/master/src/app/TodoPage/Layout/RightNavigation/TodoSections/CreateTodoSection.jsx");
    const [urlEditMode, setUrlEditMode] = useState(false);

    const [showMobileOptions, setShowMobileOptions] = useState(false);
    const [createdAt, setCreatedAt] = useState<Date>(new Date());
    
    const HandleRenameTitle = (str : string) => {
        setLinkTitle(str);
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

    const RenderConditionalChildren = ({ render, children }: { render: boolean, children: React.ReactNode }) => {
        return <>{render ? children : null}</>;
    }

    const getFaviconUrl = (link: string) => {
        try {
            const domain = new URL(link);
            return `${domain.origin}/favicon.ico`;
        } catch (error) {
            console.error('Invalid URL : Failed To Load favicon');
            return '';
        }
    };

    useEffect(() => {
        const favicon = getFaviconUrl(linkUrl);
        setFaviconUrl(favicon);
    }, [linkUrl]);

    return (
        <LinkContextMenuWrapper onContextMenu={setShowContextMenuOutline} onTitleRename={() => setTitleEditMode(true)} onUrlUpdate={() => setUrlEditMode(true)} onDelete={() => {}}>
            <Box className={`w-full dark:bg-[rgb(5,5,5,1)] flex flex-col items-center justify-center py-2 px-4 space-y-4 rounded-xl border-2 ${showContextMenuOutline ? "dark:border-indigo-300" : "dark:border-neutral-900"}`}>
                <HStack className="w-full" justifyContent={"space-between"}>
                    <Box className="flex flex-grow flex-row items-center justify-start">
                        <Image
                            src={faviconUrl}
                            alt="https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
                            width={24}
                            height={24}
                            unoptimized
                            quality={100}
                        />
                        <Input
                            value={linkTitle}
                            className={`flex flex-grow text-lg max-lg:text-base max-sm:text-xs p-2 dark:border-transparent border-2 border-transparent 
                                !ring-0 !outline-none focus-visible:!border-theme-borderNavigation disabled:opacity-100 disabled:cursor-default
                                ${titleEditMode ? "selection:bg-teal-800" : "selection:bg-transparent"}
                                ${titleEditMode ? "dark:bg-neutral-800 bg-neutral-200" : "!bg-transparent "} `}
                            disabled={!titleEditMode}
                            onChange={(e) => HandleRenameTitle(e.target.value)}
                            onBlur={() => setTitleEditMode(false)}
                            onKeyDown={(e) => {
                                if(e.key == "Enter") setTitleEditMode(false);
                            }}
                        />
                    </Box>
                    <RenderConditionalChildren render={!showMobileOptions}>
                        <Box className="w-60 max-md:w-64 flex flex-row items-center justify-end space-x-4 max-sm:hidden">
                            <Text className="text-neutral-500 max-xl:text-sm flex flex-row items-center justify-center">
                                <Eye className="mr-2" /> 20
                            </Text>
                            <Text className="dark:text-neutral-500 max-xl:text-sm">
                                {/* {new Date().toLocaleDateString()} */}
                                {createdAt.toDateString()}
                            </Text>
                        </Box>
                    </RenderConditionalChildren>
                </HStack>
                <HStack className="w-full" justifyContent={"space-between"}>
                    <Box className="w-full overflow-hidden flex flex-row items-center justify-start">
                        <RenderConditionalChildren render={!urlEditMode}>
                            <LinkIcon className="text-theme-textLink mr-2" />
                        </RenderConditionalChildren>
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
                        <RenderConditionalChildren render={!urlEditMode}>
                            <Link
                                target="_blank"
                                href="#"
                                className="text-base max-lg:text-sm max-sm:text-xs text-theme-textLink hover:text-[#a2c8f3] focus-visible:outline-theme-borderNavigation decoration-[#90c1f8] underline-offset-4 hover:underline mr-2 truncate">
                                    {linkUrl}
                            </Link>
                        </RenderConditionalChildren>
                    </Box>
                    <RenderConditionalChildren render={!showMobileOptions}>
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
                    </RenderConditionalChildren>
                </HStack>
                <RenderConditionalChildren render={showMobileOptions}>
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
                </RenderConditionalChildren>
            </Box>
        </LinkContextMenuWrapper>
    )
}

