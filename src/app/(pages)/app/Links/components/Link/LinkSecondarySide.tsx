"use client"

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLinkController } from "@/context/LinkControllerProviders";

import { Box, HStack } from "@chakra-ui/react";
import { Input } from "@/components/ui/input";

import { EllipsisVertical } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConditionalRender } from "@/components/ui/conditionalRender";
import { LinkLayout, LinkScheme } from "@/scheme/Link";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
import Image from "next/image";
import { useCopyToClipboard } from "@/hook/useCopyToClipboard";

type LinkSecondarySideProps = {
    link : LinkScheme;
    sectionID : string
    urlEditMode : boolean;
    showMobileOptions : boolean;
    layout : LinkLayout;
    onQuickLook: () => void;
    onTitleEditMode: (edit : boolean) => void;
    onUrlEditMode: (edit : boolean) => void;
    onDelete: () => void;
}

const buttonStyle = `w-auto h-auto p-0 !bg-transparent dark:text-neutral-500 dark:hover:text-white text-black !ring-0 !border-none outline-none rounded-md focus-visible:!outline-theme-borderNavigation`;
const dropdownMenuItemStyle = `text-md max-sm:text-xs py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-theme-bgThird dark:text-neutral-300 dark:hover:text-theme-textSecondary
    data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary`;

export const LinkSecondarySide = (props : LinkSecondarySideProps) => {

    const { link, sectionID, urlEditMode, showMobileOptions, layout, onUrlEditMode, onDelete, onTitleEditMode, onQuickLook  } = props;

    const [linkUrl, setLinkUrl] = useState(link.url);
    const [previewImage, setPreviewImage] = useState<string>("");

    const [ copyToClipboard ] = useCopyToClipboard();
    const { UpdateLink, GetCacheImage, IncreaseViewCount } = useLinkController()!;
    const linkRef = useRef<HTMLInputElement>(null);

    const HandleRenameUrl = () => {
        if(linkUrl.length < 6) return;

        onUrlEditMode(false);
        UpdateLink({
            currentLink : link,
            sectionID : sectionID,
            updatedLink : {
                ...link,
                url : linkUrl,
            }
        })
    }

    useEffect(() => {
        if (urlEditMode && linkRef.current) {
            const currentTimout = setTimeout(() => {
                linkRef.current?.focus();
                linkRef.current?.select();
                linkRef.current?.setSelectionRange(0, linkUrl.length);
            }, 200);
            return () => clearTimeout(currentTimout);
        }
    }, [urlEditMode]);

    useEffect(() => {
        const getImage = async () => {
            const cacheImage = await GetCacheImage({ id : link.id });
            if(cacheImage) {
                const url = URL.createObjectURL(cacheImage);
                setPreviewImage(url);
            }   
        }
        getImage();
    }, [link])

    const DropdownContents = () => {
        return (
            <>
                <DropdownMenuLabel className="text-lg max-sm:text-sm">Setting</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onTitleEditMode(true)} className={dropdownMenuItemStyle}>
                    Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUrlEditMode(true)} className={dropdownMenuItemStyle}>
                    Update Url
                </DropdownMenuItem>
                <DropdownMenuItem className={dropdownMenuItemStyle} onClick={() => copyToClipboard(link.url)}>
                    Copy URL
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onQuickLook()} className={dropdownMenuItemStyle}>
                    Quick Look
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete()} className={`${dropdownMenuItemStyle} dark:hover:!bg-red-500 dark:hover:!text-white`}>
                    Delete
                </DropdownMenuItem>
            </>
        )
    }

    return (
        <HStack className="w-full" justifyContent={"space-between"}>
            <Box className="w-full overflow-hidden flex flex-row items-center justify-start">
                {
                    urlEditMode && (                        
                        <Input
                            ref={linkRef}
                            defaultValue={linkUrl}
                            className={`flex flex-grow text-base max-lg:text-sm max-sm:text-xs max-tiny:!text-xxs p-2 dark:border-transparent border-2 border-transparent 
                                !ring-0 !outline-none focus-visible:!border-theme-borderNavigation disabled:opacity-100 disabled:cursor-default
                                ${urlEditMode ? "dark:bg-neutral-800 bg-neutral-200" : "!bg-transparent "} `}
                            disabled={!urlEditMode}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onBlur={() => HandleRenameUrl()}
                            onKeyDown={(e) => {
                                if(e.key == "Enter"){ HandleRenameUrl()};
                            }}
                        />
                    )
                }
                <ConditionalRender render={!urlEditMode && (layout.layout == "Grid Detailed" || layout.layout == "List Detailed")}>
                    <HoverCard openDelay={300} closeDelay={100}>
                        <HoverCardTrigger>
                            <Link
                                target="_blank"
                                href={link.url}
                                onClick={() => IncreaseViewCount({ link })}
                                className="text-sm text-end max-lg:text-xs text-theme-textLink hover:text-[#a2c8f3] focus-visible:outline-theme-borderNavigation decoration-[#90c1f8] underline-offset-4 hover:underline mr-2 truncate">
                                    {link.url}
                            </Link>
                        </HoverCardTrigger>
                        <HoverCardContent align="start" className={`bg-theme-bgSecondary border-2 border-theme-primaryAccent rounded-lg ${previewImage ? "" : "hidden"}`}>
                            {
                                previewImage && <Image width={100} height={100} src={previewImage} alt="image not found" unoptimized className="w-full" />
                            }
                        </HoverCardContent>
                    </HoverCard>
                </ConditionalRender>
            </Box>
            <ConditionalRender render={!showMobileOptions && (layout.layout == "Grid Detailed" || layout.layout == "List Detailed")}>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger tabIndex={1} className={buttonStyle}>
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
    )
}
