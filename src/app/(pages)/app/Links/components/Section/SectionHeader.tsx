'use client'

import { useState } from "react";

import { Box, Divider, HStack, Stack, Text } from "@chakra-ui/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { EllipsisVertical, LayoutPanelTop, Pen, SquareChevronDown } from "lucide-react";
  
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeaderLinkDrawer } from "./SectionHeaderLinkDrawer";
  

const buttonStyle = `w-auto h-auto p-0 !bg-transparent dark:text-neutral-500 dark:hover:text-white text-black !ring-0 !border-none outline-none rounded-md focus-visible:!outline-blue-500`;
const dropdownMenuItemStyle = `text-md py-2 font-normal rounded-lg px-2 transition-none 
    dark:bg-transparent dark:hover:bg-theme-bgThird dark:text-neutral-300 dark:hover:text-theme-textSecondary
    data-[highlighted]:dark:bg-theme-bgThird data-[highlighted]:dark:text-theme-textSecondary`;

export const SectionHeader = () => {

    const [openLinkCreateDrawer, setOpenLinkCreateDrawer] = useState(false);

    const [titleEditMode, setTitleEditMode] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");

    const handleCreateLink = () => {

    }

    return (
        <Box className="w-full flex flex-col items-start justify-center space-y-6 py-4">
            <HStack justifyContent={"space-between"} className="w-full px-4 group">
                {/* <Text className="text-xl">Sites Bookmark</Text> */}
                <Box className="w-auto flex flex-row items-center justify-between">
                    <Input
                        defaultValue={"Sites Bookmark"}
                        className="text-xl !bg-transparent p-0 w-auto dark:border-transparent border-2 border-transparent !ring-0 !outline-none focus-visible:!border-blue-500 disabled:opacity-100 disabled:cursor-default"
                        disabled={!titleEditMode}
                        onBlur={() => setTitleEditMode(false)}
                    />
                    <Button 
                        onClick={() => setTitleEditMode(true)} 
                        variant={"ghost"} 
                        className={`group-hover:flex text-sm ${titleEditMode ? "text-theme-textSecondary" : ""} !ring-0 !border-none outline-none rounded-md focus-visible:!outline-blue-500`}
                    >
                        <Pen className="w-4" />
                    </Button>
                </Box>
                <Stack direction={"row"} className="space-x-2">
                    <Button className={buttonStyle}>
                        <SquareChevronDown />
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
                            <DropdownMenuItem className={dropdownMenuItemStyle}>Rename Section</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenLinkCreateDrawer(true)} className={dropdownMenuItemStyle}>Add New Link</DropdownMenuItem>
                            <DropdownMenuItem className={dropdownMenuItemStyle}>Collapse/Expand Section</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem className={`${dropdownMenuItemStyle} dark:hover:!bg-red-500 dark:hover:!text-white`}>Delete All Links</DropdownMenuItem>
                            <DropdownMenuItem className={`${dropdownMenuItemStyle} dark:hover:!bg-red-500 dark:hover:!text-white`}>Delete Section</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <SectionHeaderLinkDrawer
                        openLinkCreateDrawer={openLinkCreateDrawer}
                        onOpenChange={setOpenLinkCreateDrawer}
                        onClose={() => setOpenLinkCreateDrawer(false)}
                    />

                </Stack>
            </HStack>
            <Divider className='dark:bg-neutral-700 w-full h-[1px]' />
        </Box>
    )
}
