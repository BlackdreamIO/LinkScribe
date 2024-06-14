import { Box, Flex } from "@chakra-ui/react";

import LinksNavbarSettings from "./LinksNavbarSettings";
import LinksNavbarAccount from "./LinksNavbarAccount";

export default function LinksNavbar() 
{
    return (
        <Box className="w-full dark:bg-theme-bgSecondary transition-all duration-200 p-3">
            <Flex className="w-full" justify={'space-between'} direction={'row'}>
                <LinksNavbarSettings/>
            </Flex>
        </Box>
    )
}