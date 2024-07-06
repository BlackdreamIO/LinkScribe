'use client'

import { useState } from "react";

import { Box, Divider, HStack, Stack, Text } from "@chakra-ui/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
//import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, } from "@/components/ui/context-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@radix-ui/react-context-menu";

import { EllipsisVertical, LayoutPanelTop, Pen, SquareChevronDown, SquareChevronUp, PlusIcon } from "lucide-react";
  
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeaderLinkDrawer } from "./SectionHeaderLinkDrawer";
  

const buttonStyle = `w-auto h-auto p-0 !bg-transparent dark:text-neutral-500 dark:hover:text-white text-black !ring-0 !border-none outline-none rounded-md focus-visible:!outline-theme-borderNavigation`;
const dropdownMenuItemStyle = `text-md py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-theme-bgThird dark:text-neutral-300 dark:hover:text-theme-textSecondary
    data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary !outline-none`;

type SectionHeaderProps = {
    sectionTitle : string;
    linkCount : number;
    isMinimzied : boolean;

    onContextMenu : (open : boolean) => void;
    onMinimize : () => void;
    onRename : (newName : string) => void;
    onDelete : () => void;
}

export const SectionHeader = (props : SectionHeaderProps) => {

    const { linkCount, isMinimzied, onMinimize, onRename, onDelete, onContextMenu, sectionTitle } = props;
    const [openLinkCreateDrawer, setOpenLinkCreateDrawer] = useState(false);

    const [currentSectionTitle, setCurrentSectionTitle] = useState("");
    const [titleEditMode, setTitleEditMode] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");

    const handleCreateLink = () => {

    }

    const handleMinimzie = () => {
        onMinimize();
    }

    return (
        <ContextMenu onOpenChange={onContextMenu}>
            <ContextMenuTrigger>
                <Box className="w-full flex flex-col items-start justify-center space-y-6 py-4">
                    <HStack justifyContent={"space-between"} className="w-full px-4 group">
                        <Box className="w-full flex flex-row flex-grow items-center justify-between">
                            <Input
                                defaultValue={sectionTitle}
                                className={`text-xl p-2 w-full dark:border-transparent border-2 border-transparent !ring-0 !outline-none focus-visible:!border-theme-borderNavigation disabled:opacity-100 disabled:cursor-default
                                    ${titleEditMode ? "dark:bg-neutral-800 bg-neutral-200 selection:!bg-sky-700" : "!bg-transparent selection:!bg-transparent"} truncate`}
                                disabled={!titleEditMode}
                                onBlur={() => {
                                    setTitleEditMode(false);
                                    onRename(currentSectionTitle);
                                }}
                                onChange={(e) => setCurrentSectionTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key == "Enter") {
                                        setTitleEditMode(false);
                                        onRename(currentSectionTitle);
                                    }
                                }}
                            />
                        </Box>
                        <Stack direction={"row"} className="space-x-2">
                            <Text className="dark:text-neutral-500">{linkCount}</Text>
                            <Button onClick={() => setOpenLinkCreateDrawer(true)} className={buttonStyle}>
                                <PlusIcon />
                            </Button>
                            <Button onClick={() => handleMinimzie()} className={`${buttonStyle} ${isMinimzied ? "dark:text-white text-black" : ""}`}>
                                {
                                    isMinimzied ? <SquareChevronUp /> : <SquareChevronDown />
                                }
                            </Button>
                            <Button className={buttonStyle}>
                                <LayoutPanelTop />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger className={buttonStyle}>
                                    <EllipsisVertical />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent 
                                    side="bottom" 
                                    sideOffset={15} 
                                    align="start" 
                                    className="w-60 border-neutral-600 dark:bg-theme-bgFourth mr-5 space-y-2 rounded-xl p-2 shadow-lg dark:shadow-black"
                                >
                                    <DropdownMenuLabel className="text-lg">Setting</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={() => setTitleEditMode(true)} className={dropdownMenuItemStyle}>Rename Section</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setOpenLinkCreateDrawer(true)} className={dropdownMenuItemStyle}>Add New Link</DropdownMenuItem>
                                    <DropdownMenuItem className={dropdownMenuItemStyle}>Collapse/Expand Section</DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem className={`${dropdownMenuItemStyle} dark:hover:!bg-red-500 dark:hover:!text-white`}>Delete All Links</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onDelete()} className={`${dropdownMenuItemStyle} dark:hover:!bg-red-500 dark:hover:!text-white`}>Delete Section</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <SectionHeaderLinkDrawer
                                openLinkCreateDrawer={openLinkCreateDrawer}
                                onOpenChange={setOpenLinkCreateDrawer}
                                onClose={() => setOpenLinkCreateDrawer(false)}
                            />

                        </Stack>
                    </HStack>
                    {
                        !isMinimzied && (
                            <Divider className='dark:bg-neutral-700 w-full h-[1px]' />
                        )
                    }
                </Box>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-60 space-y-2 rounded-xl p-2 shadow-lg dark:bg-theme-bgFourth dark:shadow-black border dark:border-neutral-700">
                <ContextMenuItem onClick={() => setTitleEditMode(true)} className={dropdownMenuItemStyle}>Rename Section</ContextMenuItem>
                <ContextMenuItem onClick={() => setOpenLinkCreateDrawer(true)} className={dropdownMenuItemStyle}>Add Link</ContextMenuItem>
                <ContextMenuItem className={dropdownMenuItemStyle}>Collapse/Expand Section</ContextMenuItem>
                <ContextMenuItem 
                    onClick={() => onDelete()} 
                    className={`${dropdownMenuItemStyle} dark:hover:!bg-red-500 dark:hover:!text-white`}>
                        Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
