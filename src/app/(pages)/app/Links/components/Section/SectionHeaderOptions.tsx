"use client"

import { useRef, useState } from "react";
import { useKeyboardNavigation } from "@/hook/useKeyboardNavigation";

import { Button, Stack, Text } from "@chakra-ui/react";
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

type SectionHeaderOptionsProsp = {
    minimized : boolean;
    linkCount : number;
    showLinkCount : boolean;

    onTitleEditMode : (open : boolean) => void;
    handleMinimzie : () => void;
    onOpenLinkDrawer : (open : boolean) => void;
    onDelete : () => void;
}

const buttonStyle = `w-auto h-auto p-0 !bg-transparent dark:text-neutral-500 dark:hover:text-white text-black !ring-0 !border-none outline-none rounded-md focus-visible:!outline-theme-borderNavigation`;
const dropdownMenuItemStyle = `text-md py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-theme-bgThird dark:text-neutral-300 dark:hover:text-theme-textSecondary
    data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary !outline-none`;

export const SectionHeaderOptions = (props : SectionHeaderOptionsProsp) => {

    const { minimized, linkCount, onTitleEditMode, onDelete, handleMinimzie, onOpenLinkDrawer, showLinkCount } = props;

    const [keepOpenModal, setKeepOpenModal] = useState(false);

    const parentRef = useRef<HTMLDivElement>(null);
    useKeyboardNavigation({ role: 'tab', parentRef : parentRef, direction : "horizontal" });

    return (
        <Stack ref={parentRef} direction={"row"} role="tablist" tabIndex={1} className="z-0 space-x-2 border-2 !outline-none !border-transparent focus-visible:!border-theme-borderKeyboardParentNavigation rounded-xl">
            <ConditionalRender render={showLinkCount}>
                <Text role="tab" className="dark:text-neutral-500">{linkCount}</Text>
            </ConditionalRender>
            <Button role="tab" onClick={() => onOpenLinkDrawer(true)} className={buttonStyle}>
                <PlusIcon />
            </Button>
            <Button role="tab" onClick={() => handleMinimzie()} className={`${buttonStyle} ${minimized ? "dark:text-white text-black" : ""}`}>
                {
                    minimized ? <SquareChevronUp /> : <SquareChevronDown />
                }
            </Button>
            <Button role="tab" className={buttonStyle}>
                <LayoutPanelTop />
            </Button>
            <DropdownMenu open={keepOpenModal} onOpenChange={setKeepOpenModal}>
                <DropdownMenuTrigger role="tab" className={`${buttonStyle} z-0`}>
                    <EllipsisVertical className={`z-0`} />
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    side="bottom" 
                    sideOffset={15}
                    align="start" 
                    onInteractOutside={() => setKeepOpenModal(false)}
                    className="w-60 z-50 border-neutral-600 dark:bg-theme-bgFourth mr-5 space-y-2 rounded-xl p-2 shadow-lg dark:shadow-black"
                >
                    <DropdownMenuLabel className="text-lg">Setting</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => onTitleEditMode(true)} className={dropdownMenuItemStyle}>Rename Section</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onOpenLinkDrawer(true)} className={dropdownMenuItemStyle}>Add New Link</DropdownMenuItem>
                    <DropdownMenuItem className={dropdownMenuItemStyle}>Collapse/Expand Section</DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem className={`${dropdownMenuItemStyle} dark:hover:!bg-red-500 dark:hover:!text-white`}>Delete All Links</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete()} className={`${dropdownMenuItemStyle} dark:hover:!bg-red-500 dark:hover:!text-white`}>Delete Section</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </Stack>
    )
}
