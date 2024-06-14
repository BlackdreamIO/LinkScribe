"use client"

import Image from "next/image";

import { Box, Text, Flex } from "@chakra-ui/react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

//import defaultUser from '../../../../../../public/images/defaultUser.jpg';
import { useState } from "react";

export default function LinksNavbarAccount() 
{
    const [menubarOpen, setMenubarOpen] = useState(false);

    const MenubarContentStyle = `dark:bg-theme-bgPrimary dark:border-neutral-700 mt-3 mr-3 p-2 min-w-40`;
    const MenuItemStyle = `dark:text-neutral-500 dark:hover:!text-black dark:hover:!bg-neutral-300 data-[highlighted]:dark:text-black data-[highlighted]:dark:bg-neutral-300 
        text-neutral-500 hover:!text-white hover:!bg-theme-bgPrimary transition-all duration-250 text-lg max-sm:text-xs max-xl:text-sm rounded-lg`;

    const defaultUser = 'https://cdn-icons-png.freepik.com/512/219/219986.png'

    return (
        <Box>
            <DropdownMenu onOpenChange={setMenubarOpen}>
                <DropdownMenuTrigger>
                    <Flex direction={'row'} gap={3} alignItems={'center'} className="space-x-3">
                        <Text className="max-xl:text-sm">AppNavbarAccount</Text>
                        <Image
                            src={defaultUser}
                            alt={`${defaultUser} not found`}
                            width={100}
                            height={100}
                            className="rounded-full w-9"
                        />
                    </Flex>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={MenubarContentStyle}>
                <DropdownMenuItem className={MenuItemStyle}>Sign Up</DropdownMenuItem>
                    <DropdownMenuItem className={MenuItemStyle}>Log In</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className={`${menubarOpen ? 'opacity-60' : 'opacity-0'} fixed bg-black/60 w-full h-screen z-30 -top-0 left-0 pointer-events-none transition-all duration-150 !backdrop-blur-sm`}></div>
        </Box>
    )
}