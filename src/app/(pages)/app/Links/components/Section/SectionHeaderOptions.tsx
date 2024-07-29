"use client"

import { useEffect, useRef, useState } from "react";
import { useKeyboardNavigation } from "@/hook/useKeyboardNavigation";
import { useSettingContext } from "@/context/SettingContextProvider";

import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { EllipsisVertical, LayoutPanelTop, PlusIcon, SquareChevronDown, SquareChevronUp } from "lucide-react";

import { 
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuContent,
} from './DynamicImport';

import { ConditionalRender } from "@/components/ui/conditionalRender";
import { LinkLayout } from "@/scheme/Link";
import { Button } from "@/components/ui/button";
import { LinkLayoutType } from "@/types/SettingTypes";

type SectionHeaderOptionsProsp = {
    minimized : boolean;
    linkCount : number;
    showLinkCount : boolean;
    id : string;
    onTitleEditMode : (open : boolean) => void;
    handleMinimzie : () => void;
    onOpenLinkDrawer : (open : boolean) => void;
    onDelete : () => void;
    onLayoutChange : (layout : LinkLayout) => void;
}

const buttonStyle = `w-auto h-auto p-0 !bg-transparent dark:text-neutral-500 dark:hover:text-white text-black !ring-0 !border-none outline-none rounded-md focus-visible:!outline-theme-borderNavigation`;
const dropdownMenuItemStyle = `text-md max-sm:text-xxs py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-theme-bgThird dark:text-neutral-300 dark:hover:text-theme-textSecondary
    data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary !outline-none`;


export const SectionHeaderOptions = (props : SectionHeaderOptionsProsp) => {

    const { minimized, linkCount, onTitleEditMode, onDelete, handleMinimzie, onOpenLinkDrawer, showLinkCount, onLayoutChange } = props;

    const [keepOpenModal, setKeepOpenModal] = useState(false);
    const [currentLayout, setCurrentLayout] = useState<LinkLayoutType>("Grid Detailed");
    const [currentLayoutSize, setCurrentLayoutSize] = useState(1);

    const parentRef = useRef<HTMLDivElement>(null);
    useKeyboardNavigation({ role: 'tab', parentRef : parentRef, direction : "horizontal" });

    const { linkLayoutDefaultSize } = useSettingContext()!;

    useEffect(() => {
        onLayoutChange({ layout : currentLayout, size : currentLayoutSize });
    }, [currentLayout, currentLayoutSize])

    return (
        <Stack ref={parentRef} direction={"row"} role="tablist" tabIndex={1} className="z-0 space-x-2 border-2 !outline-none !border-transparent focus-visible:!border-theme-borderKeyboardParentNavigation rounded-xl">
            <ConditionalRender render={showLinkCount}>
                <Text role="tab" className="dark:text-neutral-500 max-sm:text-sm">{linkCount}</Text>
            </ConditionalRender>
            <Button role="tab" onClick={() => onOpenLinkDrawer(true)} className={buttonStyle}>
                <PlusIcon className="max-sm:w-4" />
            </Button>
            <Button role="tab" onClick={() => handleMinimzie()} className={`${buttonStyle} ${minimized ? "dark:text-white text-black" : ""}`}>
                {
                    minimized ? <SquareChevronUp className="max-sm:w-4" /> : <SquareChevronDown className="max-sm:w-4" />
                }
            </Button>

            <DropdownMenu modal>
                <DropdownMenuTrigger role="tab" className={`${buttonStyle} z-0`}>
                    <LayoutPanelTop className={`z-0 max-sm:w-4`} />
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    side="bottom" 
                    sideOffset={15}
                    align="start" 
                    onInteractOutside={() => setKeepOpenModal(false)}
                    className="w-60 z-50 border-neutral-600 dark:bg-theme-bgFourth mr-5 space-y-2 rounded-xl p-2 shadow-lg dark:shadow-black"
                >
                    <DropdownMenuLabel className="text-lg max-sm:text-sm">Layout</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentLayout("Grid Detailed");
                            setCurrentLayoutSize(linkLayoutDefaultSize);
                        }}
                        className={dropdownMenuItemStyle}>
                            Grid {"(Large)"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentLayout("Grid Compact");
                            setCurrentLayoutSize(linkLayoutDefaultSize);
                        }}
                        className={dropdownMenuItemStyle}>
                            Grid {"(Compact)"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentLayout("List Compact");
                            setCurrentLayoutSize(1);
                        }}
                        className={dropdownMenuItemStyle}>
                            List {"(Compact)"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentLayout("List Detailed");
                            setCurrentLayoutSize(1);
                        }}
                        className={dropdownMenuItemStyle}>
                            List {"(Large)"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setCurrentLayout("Compact")}
                        className={dropdownMenuItemStyle}>
                            Compact
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>

                    <Box onClick={(e) => e.preventDefault()} className="bg-transparent dark:hover:bg-neutral-900 border border-transparent dark:hover:border-neutral-600 flex flex-col items-start justify-center p-2 rounded-lg transition-all duration-150">
                        Horizontal Size
                        <HStack className="gap-2 w-full mt-4">
                            {
                                Array(4).fill("").map((x, i) => (
                                    <DropdownMenuItem
                                        key={i}
                                        className={`${dropdownMenuItemStyle} w-full flex flex-row items-center justify-center dark:bg-neutral-900 border border-neutral-700 rounded-md p-1`}
                                        tabIndex={1}
                                        onClick={() => setCurrentLayoutSize(i + 1)}
                                    >
                                        {i + 1}
                                    </DropdownMenuItem>
                                ))
                            }
                        </HStack>
                    </Box>

                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu open={keepOpenModal} onOpenChange={setKeepOpenModal}>
                <DropdownMenuTrigger role="tab" className={`${buttonStyle} z-0`}>
                    <EllipsisVertical className={`z-0 max-sm:w-4`} />
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    side="bottom" 
                    sideOffset={15}
                    align="start" 
                    onInteractOutside={() => setKeepOpenModal(false)}
                    className="w-60 z-50 border-neutral-600 dark:bg-theme-bgFourth mr-5 space-y-2 rounded-xl p-2 shadow-lg dark:shadow-black"
                >
                    <DropdownMenuLabel className="text-lg max-sm:text-sm">Setting</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => onTitleEditMode(true)} className={dropdownMenuItemStyle}>
                        Rename Section
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onOpenLinkDrawer(true)} className={dropdownMenuItemStyle}>
                        Add New Link
                    </DropdownMenuItem>
                    <DropdownMenuItem className={dropdownMenuItemStyle}>
                        Collapse/Expand Section
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem disabled={linkCount==0} className={`${dropdownMenuItemStyle} data-[highlighted]:!bg-red-500 data-[highlighted]:dark:text-white dark:hover:!bg-red-500 dark:hover:!text-white`}>
                        Delete All Links {`(${linkCount})`}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete()} className={`${dropdownMenuItemStyle} data-[highlighted]:!bg-red-500 data-[highlighted]:dark:text-white dark:hover:!bg-red-500 dark:hover:!text-white`}>
                        Delete Section
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </Stack>
    )
}
