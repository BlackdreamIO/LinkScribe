"use client"

import { Box, HStack, Text } from "@chakra-ui/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConditionalRender } from "@/components/ui/conditionalRender";
import { Eye, EllipsisVertical } from "lucide-react";
import { LinkLayout, LinkScheme } from "@/scheme/Link";
import { useCopyToClipboard } from "@/hook/useCopyToClipboard";

type LinkMobileDropdownProps = {
    layout : LinkLayout;
    showMobileOptions: boolean;
    link : LinkScheme;

    onTitleEditMode : (value : boolean) => void;
    onLinkEditMode : (value : boolean) => void;
    handleDeleteLink : () => void;
}

const buttonStyle = `w-auto h-auto p-0 !bg-transparent dark:text-neutral-500 dark:hover:text-white text-black !ring-0 !border-none outline-none rounded-md focus-visible:!outline-theme-borderNavigation`;
const dropdownMenuItemStyle = `text-md max-sm:text-xs py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-theme-bgThird dark:text-neutral-300 dark:hover:text-theme-textSecondary
    data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary`;

export const LinkMobileDropdown = (props : LinkMobileDropdownProps) => {

    const { showMobileOptions, layout, onTitleEditMode, onLinkEditMode, handleDeleteLink, link : { visitCount, created_at, url } } = props;
    const [copyToClipboard] = useCopyToClipboard();

    return (
        <ConditionalRender render={showMobileOptions && (layout.layout == "Grid Detailed" || layout.layout == "List Detailed")}>
            <HStack className="w-full" justifyContent={"space-between"}>
                <Box className="flex flex-row items-center justify-end space-x-4">
                    <Text className="text-neutral-500 max-lg:text-sm max-sm:!text-xxs flex flex-row items-center justify-center">
                        <Eye className="mr-2" /> {visitCount}
                    </Text>
                    <Text className="dark:text-neutral-500 max-lg:text-sm max-sm:!text-xxs">
                        {new Date(created_at).toLocaleDateString()}
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
                        <DropdownMenuLabel className="text-lg max-sm:text-sm">Setting</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onTitleEditMode(true)} className={dropdownMenuItemStyle}>
                            Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onLinkEditMode(true)} className={dropdownMenuItemStyle}>
                            Update Url
                        </DropdownMenuItem>
                        <DropdownMenuItem className={dropdownMenuItemStyle} onClick={() => copyToClipboard(url)}>
                            Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem className={dropdownMenuItemStyle}>
                            Quick Look
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteLink()} className={`${dropdownMenuItemStyle} dark:hover:!bg-red-500 dark:hover:!text-white`}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </HStack>
        </ConditionalRender>
    )
}
