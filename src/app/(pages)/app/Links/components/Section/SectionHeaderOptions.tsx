"use client"

import { useRef, useState } from "react";
import { useKeyboardNavigation } from "@/hook/useKeyboardNavigation";
import { useSettingContext } from "@/context/SettingContextProvider";

import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { CirclePlus, EllipsisVertical, LayoutPanelTop, PlusIcon, Search, SquareChevronDown, SquareChevronUp, X } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";

import { 
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuContent,
} from './DynamicImport';

import { ConditionalRender } from "@/components/ui/conditionalRender";
import { Button } from "@/components/ui/button";
import { useSectionContext } from "@/context/SectionContextProvider";
import { useSectionController } from "@/context/SectionControllerProviders";
import { LinkLayout } from "@/scheme/Link";
import { useSendToastMessage } from "@/hook/useSendToastMessage";

type SectionHeaderOptionsProsp = {
    minimized : boolean;
    showLinkCount : boolean;
    onTitleEditMode : (open : boolean) => void;
    handleMinimzie : () => void;
    onDelete : () => void;
}

const buttonStyle = `w-auto h-auto p-0 !bg-transparent dark:text-neutral-500 dark:hover:text-white text-black !ring-0 !border-none outline-none rounded-md focus-visible:!outline-theme-borderNavigation`;
const dropdownMenuItemStyle = `text-md max-sm:text-xxs py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-theme-bgThird dark:text-neutral-300 dark:hover:text-theme-textSecondary
    data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary !outline-none`;


export const SectionHeaderOptions = (props : SectionHeaderOptionsProsp) => {

    const { minimized, onTitleEditMode, onDelete, handleMinimzie, showLinkCount } = props;

    const [openLinksDeleteConfirmation, setOpenLinksDeleteConfirmation] = useState(false);

    const parentRef = useRef<HTMLDivElement>(null);
    const parentEmailSelectModalRef = useRef<HTMLDivElement>(null);
    useKeyboardNavigation({ role: 'tab', parentRef : parentRef, direction : "horizontal" });
    useKeyboardNavigation({ role: 'tab', parentRef : parentEmailSelectModalRef, direction : "vertical" });

    const { linkLayoutDefaultSize } = useSettingContext()!;
    const { currentSection, setOpenLinkCreateDrawer, setOpenSectionTransferer, openLinkSearch, setOpenLinkSearch } = useSectionContext();
    const { UpdateSection } = useSectionController();

    const { ToastMessage } = useSendToastMessage();
    
    const handleUpdateLinkLayout = (layout : LinkLayout) => {
        UpdateSection({
            currentSection: currentSection,
            updatedSection : { ...currentSection, links_layout : layout }
        })
    }

    const handleDeleteAllLinks = () => {
        UpdateSection({
            currentSection: currentSection,
            updatedSection : { ...currentSection, links : [] }
        })
        ToastMessage({ message : "All links deleted", type : "Success" })
    }

    return (
        <Stack ref={parentRef} direction={"row"} role="tablist" tabIndex={1} className="z-0 space-x-2 border-2 !outline-none !border-transparent focus-visible:!border-theme-borderKeyboardParentNavigation rounded-xl">
            <ConditionalRender render={showLinkCount}>
                <Text role="tab" className="dark:text-neutral-500 max-sm:text-sm">{currentSection.links.length}</Text>
            </ConditionalRender>
            <Button role="tab" className={buttonStyle} onClick={() => setOpenLinkSearch(!openLinkSearch)}>
                {
                    openLinkSearch ? <X className="max-sm:w-4" /> : <Search className="max-sm:w-4" />
                }
            </Button>
            <Button role="tab" onClick={() => setOpenLinkCreateDrawer(true)} className={buttonStyle}>
                {/* <PlusIcon className="max-sm:w-4" /> */}
                <CirclePlus className="max-sm:w-4" />
            </Button>
            <Button role="tab" onClick={() => handleMinimzie()} className={`${buttonStyle} ${minimized ? "dark:text-white text-black" : ""}`}>
                {
                    minimized ? <SquareChevronUp className="max-sm:w-4" /> : <SquareChevronDown className="max-sm:w-4" />
                }
            </Button>

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger role="tab" className={`${buttonStyle} z-0`}>
                    <LayoutPanelTop className={`z-0 max-sm:w-4`} />
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    side="bottom" 
                    sideOffset={15}
                    align="start" 
                    className="w-60 z-50 border-neutral-600 dark:bg-theme-bgFourth mr-5 space-y-2 rounded-xl p-2 shadow-lg dark:shadow-black"
                >
                    <DropdownMenuLabel className="text-lg max-sm:text-sm">Layout</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    
                    <DropdownMenuItem
                        onClick={() => {
                            handleUpdateLinkLayout({ layout : "Grid Detailed", size : linkLayoutDefaultSize });
                        }}
                        className={dropdownMenuItemStyle}>
                            Grid {"(Large)"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            handleUpdateLinkLayout({ layout : "Grid Compact", size : linkLayoutDefaultSize });
                        }}
                        className={dropdownMenuItemStyle}>
                            Grid {"(Compact)"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            handleUpdateLinkLayout({ layout : "List Compact", size : 1 });
                        }}
                        className={dropdownMenuItemStyle}>
                            List {"(Compact)"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            handleUpdateLinkLayout({ layout : "List Detailed", size : 1 });
                        }}
                        className={dropdownMenuItemStyle}>
                            List {"(Large)"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleUpdateLinkLayout({ layout : "Compact", size : linkLayoutDefaultSize })}
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
                                        onClick={() => handleUpdateLinkLayout({ ...currentSection.links_layout, size : i + 1 })}
                                    >
                                        {i + 1}
                                    </DropdownMenuItem>
                                ))
                            }
                        </HStack>
                    </Box>

                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger role="tab" className={`${buttonStyle} z-0`}>
                    <EllipsisVertical className={`z-0 max-sm:w-4`} />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" sideOffset={15} align="start" 
                    className="w-60 z-50 border-neutral-600 dark:bg-theme-bgFourth mr-5 space-y-2 rounded-xl p-2 shadow-lg dark:shadow-black"
                >
                    <DropdownMenuLabel className="text-lg max-sm:text-sm">Setting</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => onTitleEditMode(true)} className={dropdownMenuItemStyle}>
                        Rename Section
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenLinkCreateDrawer(true)} className={dropdownMenuItemStyle}>
                        Add New Link
                    </DropdownMenuItem>
                    <DropdownMenuItem className={dropdownMenuItemStyle}>
                        Collapse/Expand Section
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenSectionTransferer(true)} className={dropdownMenuItemStyle}>
                        Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => setOpenLinksDeleteConfirmation(true)} disabled={currentSection.links.length==0} className={`${dropdownMenuItemStyle} data-[highlighted]:!bg-red-500 data-[highlighted]:dark:text-white dark:hover:!bg-red-500 dark:hover:!text-white`}>
                        Delete All Links {`(${currentSection.links.length})`}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete()} className={`${dropdownMenuItemStyle} data-[highlighted]:!bg-red-500 data-[highlighted]:dark:text-white dark:hover:!bg-red-500 dark:hover:!text-white`}>
                        Delete Section
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={openLinksDeleteConfirmation} onOpenChange={setOpenLinksDeleteConfirmation}>
                <DialogContent className="w-96 rounded-xl p-3 shadow-lg dark:bg-theme-bgFourth bg-neutral-50 dark:shadow-black border dark:border-neutral-700">
                    <DialogTitle className="text-center">Delete All Assoiete Links To This Section</DialogTitle>
                    <DialogFooter className="flex flex-col-reverse">
                        <Button className="rounded-lg !ring-0 !border-none focus-visible:outline-theme-borderNavigation outline-4 outline-transparent outline-double" variant={"secondary"} onClick={() => setOpenLinksDeleteConfirmation(false)}> Cancel </Button>
                        <Button className="my-2 rounded-lg bg-red-500 hover:bg-red-600 !ring-0 !border-none focus-visible:outline-theme-borderNavigation outline-4 outline-transparent outline-double" variant={"destructive"}
                            onClick={() => {
                                setOpenLinksDeleteConfirmation(false);
                                handleDeleteAllLinks();
                            }}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </Stack>
    )
}
