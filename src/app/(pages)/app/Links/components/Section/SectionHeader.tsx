'use client'

import { useRef, useState } from "react";

import { Box, Divider, HStack, Stack, Text } from "@chakra-ui/react";
import { EllipsisVertical, LayoutPanelTop, SquareChevronDown, SquareChevronUp, PlusIcon } from "lucide-react";
  
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LinkScheme } from "@/scheme/Link";
  
import { 
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,

    SectionHeaderLinkDrawer
} from './DynamicImport';
import { useKeyboardNavigation } from "@/hook/useKeyboardNavigation";
import { SectionHeaderOptions } from "./SectionHeaderOptions";
import { useSettingContext } from "@/context/SettingContextProvider";

const dropdownMenuItemStyle = `text-md py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-theme-bgThird dark:text-neutral-300 dark:hover:text-theme-textSecondary
    data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary !outline-none`;

type SectionHeaderProps = {
    sectionTitle : string;
    linkCount : number;
    isMinimzied : boolean;
    showLinkCount : boolean;

    onContextMenu : (open : boolean) => void;
    onMinimize : () => void;
    onRename : (newName : string) => void;
    onCreateLink : (link : LinkScheme) => void;
    onDelete : () => void;
}

export const SectionHeader = (props : SectionHeaderProps) => {

    const { linkCount, isMinimzied, onMinimize, onRename, onDelete, onCreateLink, onContextMenu, sectionTitle, showLinkCount } = props;
    const [openLinkCreateDrawer, setOpenLinkCreateDrawer] = useState(false);

    const [currentSectionTitle, setCurrentSectionTitle] = useState(sectionTitle);
    const [titleEditMode, setTitleEditMode] = useState(false);

    const parentRef = useRef<HTMLDivElement>(null);
    useKeyboardNavigation({ role: 'tab', parentRef : parentRef, direction : "both" });

    const handleMinimzie = () => {
        onMinimize();
    }

    return (
        <ContextMenu onOpenChange={onContextMenu} modal={false}>
            <ContextMenuTrigger>
                <Box className="w-full flex flex-col items-start justify-center space-y-6 py-4">
                    <HStack justifyContent={"space-between"} className="w-full px-4 group">
                        <Box className="w-full flex flex-row flex-grow items-center justify-between">
                            <Input
                                value={currentSectionTitle}
                                className={`text-xl p-2 w-full dark:border-transparent border-2 border-transparent !ring-0 !outline-none focus-visible:!border-theme-borderNavigation disabled:opacity-100 disabled:cursor-default
                                    ${titleEditMode ? "dark:bg-neutral-800 bg-neutral-200 selection:!bg-sky-700" : "!bg-transparent selection:!bg-transparent"} truncate`}
                                disabled={!titleEditMode}
                                onBlur={() => {
                                    setTitleEditMode(false);
                                    if(currentSectionTitle.length > 3) {
                                        onRename(currentSectionTitle);
                                    }
                                    else {
                                        setCurrentSectionTitle(sectionTitle);
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
                                            setCurrentSectionTitle(sectionTitle);
                                        }
                                    }
                                }}
                            />
                        </Box>

                        <SectionHeaderOptions
                            linkCount={linkCount}
                            minimized={isMinimzied}
                            showLinkCount={showLinkCount}
                            handleMinimzie={handleMinimzie}
                            onTitleEditMode={setTitleEditMode}
                            onDelete={onDelete}
                            onOpenLinkDrawer={setOpenLinkCreateDrawer}
                        />
                    </HStack>
                    {
                        !isMinimzied && (
                            <Divider className='dark:bg-neutral-700 w-full h-[1px]' />
                        )
                    }
                </Box>

                <SectionHeaderLinkDrawer
                    openLinkCreateDrawer={openLinkCreateDrawer}
                    onOpenChange={setOpenLinkCreateDrawer}
                    onCreate={onCreateLink}
                    onClose={() => setOpenLinkCreateDrawer(false)}
                />
                
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
