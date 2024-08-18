'use client'

import { useRef, useState } from "react";
import { LinkScheme } from "@/scheme/Link";
import { useKeyboardNavigation } from "@/hook/useKeyboardNavigation";

import { Box, Divider, HStack } from "@chakra-ui/react";  
import { Input } from "@/components/ui/input";
  
import { 
    SectionHeaderLinkDrawer
} from './DynamicImport';

import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem
} from "@radix-ui/react-context-menu";

import { SectionHeaderOptions } from "./SectionHeaderOptions";
import ErrorManager from "../../../components/ErrorHandler/ErrorManager";
import { SectionTransferer } from "./SectionTransferer";
import { SectionScheme } from "@/scheme/Section";

const dropdownMenuItemStyle = `text-md py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-theme-bgThird dark:text-neutral-300 dark:hover:text-theme-textSecondary
    hover:bg-neutral-200 data-[highlighted]:bg-neutral-200
    data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary !outline-none`;

type SectionHeaderProps = {
    section : SectionScheme;
    isMinimzied : boolean;
    showLinkCount : boolean;
    onContextMenu : (open : boolean) => void;
    onMinimize : () => void;
    onRename : (newName : string) => void;
    onCreateLink : (link : LinkScheme) => void;
    onDelete : () => void;
    onDeleteAllLinks : () => void;
}

export const SectionHeader = (props : SectionHeaderProps) => {

    const { isMinimzied, onMinimize, onRename, onDelete, onCreateLink, onContextMenu, showLinkCount, section, onDeleteAllLinks } = props;
    const [openLinkCreateDrawer, setOpenLinkCreateDrawer] = useState(false);

    const [currentSectionTitle, setCurrentSectionTitle] = useState(section.title);
    const [titleEditMode, setTitleEditMode] = useState(false);

    const [sectionToTransfer, setSectionToTransfer] = useState<SectionScheme>(section);
    const [openSectionTransferer, setOpenSectionTransferer] = useState(false);

    const parentRef = useRef<HTMLDivElement>(null);
    useKeyboardNavigation({ role: 'tab', parentRef : parentRef, direction : "both" });

    const handleMinimzie = () => {
        onMinimize();
    }

    return (
        <ContextMenu onOpenChange={onContextMenu} modal={false}>
            <ContextMenuTrigger>
                <Box className="w-full flex flex-col items-start justify-center space-y-6 py-4 max-sm:py-2">
                    <HStack justifyContent={"space-between"} className="w-full px-4 group">
                        <Box className="w-full flex flex-row flex-grow items-center justify-between">
                            <Input
                                value={currentSectionTitle}
                                className={`text-xl max-sm:text-sm p-2 w-full dark:border-transparent border-2 border-transparent !ring-0 !outline-none focus-visible:!border-theme-borderNavigation disabled:opacity-100 disabled:cursor-default
                                    ${titleEditMode ? "dark:bg-neutral-800 bg-neutral-200 selection:!bg-sky-700" : "!bg-transparent selection:!bg-transparent"} truncate`}
                                disabled={!titleEditMode}
                                onBlur={() => {
                                    setTitleEditMode(false);
                                    if(currentSectionTitle.length > 3) {
                                        onRename(currentSectionTitle);
                                    }
                                    else {
                                        setCurrentSectionTitle(section.title);
                                    }
                                }}
                                onChange={(e) => setCurrentSectionTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key == "Enter") {
                                        setTitleEditMode(false);
                                        if(currentSectionTitle.length > 3) {
                                            onRename(currentSectionTitle);
                                        }
                                        else {
                                            setCurrentSectionTitle(section.title);
                                        }
                                    }
                                }}
                            />
                        </Box>

                        <ErrorManager>
                            <SectionHeaderOptions
                                id={section.id}
                                linkCount={section.links.length}
                                minimized={isMinimzied}
                                showLinkCount={showLinkCount}
                                handleMinimzie={handleMinimzie}
                                onTitleEditMode={setTitleEditMode}
                                onDelete={onDelete}
                                onOpenLinkDrawer={setOpenLinkCreateDrawer}
                                onOpenSectionTransferer={() => {
                                    setSectionToTransfer(section);
                                    setOpenSectionTransferer(true);
                                }}
                                onDeleteAllLinks={onDeleteAllLinks}
                            />
                        </ErrorManager>
                    </HStack>
                    {
                        !isMinimzied && (
                            <Divider className='dark:bg-neutral-700 w-full h-[1px]' />
                        )
                    }
                </Box>

                <SectionTransferer
                    open={openSectionTransferer}
                    onchange={setOpenSectionTransferer}
                    sectionToTransfer={sectionToTransfer}
                />

                <SectionHeaderLinkDrawer
                    openLinkCreateDrawer={openLinkCreateDrawer}
                    sectionID={section.id}
                    onOpenChange={setOpenLinkCreateDrawer}
                    onCreate={onCreateLink}
                    onClose={() => setOpenLinkCreateDrawer(false)}
                />
                
            </ContextMenuTrigger>
            <ContextMenuContent className="w-60 space-y-2 rounded-xl p-2 shadow-lg dark:bg-theme-bgFourth bg-neutral-50 dark:shadow-black border dark:border-neutral-700 z-20">
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
