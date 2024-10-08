import { Box, Flex } from "@chakra-ui/react";

import LinksNavbarSettings from "./LinksNavbarSettings";
import { LinkNavbarAdditionals } from "./LinkNavbarAdditionals";

export default function LinksNavbar() 
{
    return (
        <Box className="w-full dark:bg-theme-bgSecondary transition-all duration-200 p-3">
            <Flex className="w-full relative" justify={'space-between'} alignItems={"center"} direction={'row'}>
                <LinksNavbarSettings/>
                <p className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl text-neutral-600 leading-loose tracking-wider">LINKSCRIBE</p>
                <LinkNavbarAdditionals/>
            </Flex>
        </Box>
    )
}